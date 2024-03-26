import uuid
from typing import Type
from connection import get_db

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi_users import FastAPIUsers
from sqlalchemy import select, update, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute

from auth.auth import auth_backend
from auth.models import (
    User,
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
    Referee,
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
    UserRead,
    RefereeUpdate,
    UserCreate,
    NewUser,
)
from teams.models import TeamMember
from event.models import Participant, Match


router = APIRouter(prefix="/users", tags=["Users"])
fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])
current_user = fastapi_users.current_user()
athlete_update = AthleteUpdate
sysadmin_update = SysAdminUpdate
organizer_update = OrganizerUpdate
spectator_update = SpectatorUpdate
referee_update = RefereeUpdate
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
    allowed_roles = [1, 2, 3, 4, 5]  # Роли, которым разрешено загружать изображения

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
        1: user_manager.update_athlete_profile,
        2: user_manager.update_organizer_profile,
        3: user_manager.update_spectator_profile,
        4: user_manager.update_sysadmin_profile,
        5: user_manager.update_referee_profile
    }  # надо ещё судей добавить и их обработчики

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
    return await update_profile(
        SystemAdministrator,
        sysadmin_data,
        current_user,
        user_manager
    )


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


'''REFEREES'''


@router.post("/upload-referee-photo")
async def upload_referee_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Referee, "logo_url", image,
                              current_user, db)


@router.put("/update-referee-profile")
async def update_referee_profile(
    referee_data: referee_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        SystemAdministrator,
        referee_data,
        current_user,
        user_manager
    )


'''  USERS  '''


@router.get("/verify/{token}")
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


@router.post("/forgot-password/{email}")
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


@router.post("/reset-forgot-password/{token}")
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


@router.get("/me", response_model=UserRead)
async def get_current_user(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(User).where(User.id == current_user.id))
    user = query.scalars().first()

    return user


@router.get("/me/events")
async def get_current_user_events(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id))
    athlete_id = query.scalars().first()

    query = await db.execute(select(
        TeamMember.id).where(TeamMember.member == athlete_id))
    member_id = query.scalars().first()

    query = await db.execute(select(
        Participant.event_id).where(Participant.player_id == member_id))
    events = query.scalars().all()

    return {"events": events}


@router.get("/me/matches")
async def get_current_user_matches(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id))
    athlete_id = query.scalars().first()

    query = await db.execute(select(
        TeamMember.id).where(TeamMember.member == athlete_id))
    member_id = query.scalars().first()

    query = await db.execute(select(
        Match.id).where(
            Match.player_one == member_id and Match.player_two == member_id))
    matches = query.scalars().all()

    return {"matches": matches}


@router.get("/me/athlete")
async def get_current_user_athlete(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete).where(Athlete.user_id == current_user.id))
    athlete = query.scalars().first()

    return athlete


@router.post("/me/referee")
async def get_current_user_referee(
    referee_data: referee_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        Referee,
        referee_data,
        current_user,
        user_manager
    )


@router.post("/create")
async def create_user(
    user_create: UserCreate,
    user_data: NewUser,
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db)
):
    user = await user_manager.create(user_create)
    user_role = user.role_id

    if user_role == 1:
        await db.execute(insert(Athlete).values(
            user_id=user.id,
            weight=float(user_data.info['athlete_weight']),
            height=int(user_data.info['athlete_height']),
        ))
        await db.commit()

    if user_role == 2:
        await db.execute(insert(EventOrganizer).values(
            user_id=user.id,
            organization_name=user_data.info['event_organizer_organization_name'],
            website=user_data.info['event_organizer_organization_website'],
            contact_email=user_data.info['event_organizer_organization_contact_email'],
            contact_phone=user_data.info['event_organizer_organization_contact_phone'],
        ))
        await db.commit()

    if user_role == 3:
        await db.execute(insert(Spectator).values(
            user_id=user.id,
            phone_number=user_data.info['spectator_phone_number'],
        ))
        await db.commit()

    if user_role == 4:
        await db.execute(insert(SystemAdministrator).values(
            user_id=user.id
        ))
        await db.commit()

    if user_role == 5:
        await db.execute(insert(Referee).values(
            user_id=user.id,
            qualification_level=int(user_data.info['referee_qualification_level']),
        ))
        await db.commit()

    return user
