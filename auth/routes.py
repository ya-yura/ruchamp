import uuid
from typing import Type
from connection import get_db

from fastapi import APIRouter, Depends, HTTPException
from fastapi_users import FastAPIUsers
from fastapi_users import FastAPIUsers
from fastapi import Depends, HTTPException, File, UploadFile
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute

from auth.auth import auth_backend
from auth.models import User
from auth.manager import get_user_manager
from auth.schemas import AthleteUpdate, SpectatorUpdate, SysAdminUpdate, OrganizerUpdate
from auth.auth import auth_backend
from auth.models import (
    User,
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
)
from auth.manager import (
    get_user_manager,
    UserManager,
)
from auth.mailer import send_forgot_password_email
from auth.schemas import (
    AthleteUpdate,
    UserDB,
    SpectatorUpdate,
    SysAdminUpdate,
    OrganizerUpdate,
)


router = APIRouter()
fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])
current_user = fastapi_users.current_user()
athlete_update = AthleteUpdate
sysadmin_update = SysAdminUpdate
organizer_update = OrganizerUpdate
spectator_update = SpectatorUpdate
user_db_verify = UserDB


def is_model_field(model: Type, field_name: str) -> bool:
    """
    Проверяет, существует ли атрибут с указанным именем в модели.
    """
    return isinstance(getattr(model, field_name, None), InstrumentedAttribute)



async def upload_image(
    model: Type,
    image_field: str,
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    role_id = current_user.role_id
    allowed_roles = [2, 3, 4, 5]  # Роли, которым разрешено загружать изображения

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    if not is_model_field(model, image_field):
        raise HTTPException(
            status_code=400, detail="Invalid image field for the model")

    with open(f"images/{image.filename}", "wb") as f:
        f.write(image.file.read())

    image_url = f"images/{image.filename}"
    db.execute(update(model).where(model.user_id == current_user.id).values(
        {image_field: image_url}))

    await db.commit()

    return {"message": f"{image_field} uploaded successfully"}


async def update_profile(
    model: Type,
    data: Type,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    role_id = current_user.role_id
    allowed_roles = {
        2: user_manager.update_athlete_profile,
        3: user_manager.update_organizer_profile,
        4: user_manager.update_spectator_profile,
        5: user_manager.update_sysadmin_profile
    }

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    update_function = allowed_roles[role_id]
    await update_function(current_user, data)

    return {"message": f"{model.__name__} profile updated successfully"}




'''  ATHLETE  '''


@router.post("/upload-athlete-photo")
async def upload_athlete_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Athlete, "photo_url", image, current_user, db)


@router.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Athlete, athlete_data, current_user,
                                user_manager)


'''  SPECTATOR  '''


@router.post("/upload-spectator-photo")
async def upload_spectator_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Spectator, "photo_url", image, current_user, db)


@router.put("/update-spectator-profile")
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Spectator, spectator_data, current_user,
                                user_manager)


'''  SYSADMIN  '''


@router.post("/upload-sysadmin-photo")
async def upload_sysadmin_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(SystemAdministrator, "photo_url", image,
                              current_user, db)


@router.put("/update-sysadmin-profile")
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(SystemAdministrator, sysadmin_data,
                                current_user, user_manager)


'''  ORGANIZER  '''


@router.post("/upload-organizer-photo")
async def upload_organizer_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(EventOrganizer, "logo_url", image,
                              current_user, db)


@router.put("/update-organizer-profile")
async def update_organizer_profile(
    organizer_data: organizer_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        EventOrganizer,
        organizer_data,
        current_user,
        user_manager
    )


'''  USERS  '''


@router.get("/verify/{token}", tags=["users"])
async def verify_user(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User.email).where(
        User.verification_token == token)
    )
    email = result.scalars().first()
    await db.execute(update(User).where(
        User.email == email).values(is_verified=True, verification_token="")
    )
    await db.commit()
    return {"email": email}


@router.post("/forgot-password/{email}", tags=["users"])
async def forgot_password_email(
    email: str,
    db: AsyncSession = Depends(get_db),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = await db.execute(select(User.username).where(User.email == email))
    user_name = user.scalars().first()
    if user_name is None:
        raise HTTPException(status_code=404, detail="User not found")
    token = str(uuid.uuid4())
    await db.execute(update(User).where(
        User.email == email).values(verification_token=token))

    # send_forgot_password_email(username=user_name, email=email, token=token)
    # await user_manager.on_after_forgot_password(user_name, token)
    await db.commit()
    return {"token": token}


@router.post("/reset-forgot-password/{token}", tags=["users"])
async def forgot_password(
    token: str,
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db)
):
    user = await db.execute(select(User.email).where(
        User.verification_token == token))

    email = user.scalars().first()
    if email is None:
        raise HTTPException(status_code=404, detail="User not found")


    return {"email": email}
