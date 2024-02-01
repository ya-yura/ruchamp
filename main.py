from fastapi_users import FastAPIUsers, fastapi_users
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute
from auth.auth import auth_backend
from auth.models import User, Athlete, EventOrganizer, Spectator, SystemAdministrator, Team
from auth.manager import get_user_manager, UserManager
from auth.schemas import UserRead, UserCreate, AthleteUpdate, UserDB, SpectatorUpdate, SysAdminUpdate, OrganizerUpdate
from connection import get_db
from typing import Type, Union

app = FastAPI(
    title="Ruchamp"
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

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
    db: AsyncSession = Depends(get_db),  # Используем зависимость для асинхронной сессии
):
    if current_user.role_id != 3:  # Предположим, что 3 - это роль организатора
        raise HTTPException(status_code=403, detail="Only organizer can update their avatar")

    # Проверяем, что переданный атрибут модели является полем для изображения
    if not is_model_field(model, image_field):
        raise HTTPException(status_code=400, detail="Invalid image field for the model")

    # Пример сохранения файла в определенное место
    with open(f"images/{image.filename}", "wb") as f:
        f.write(image.file.read())

    # Обновляем поле изображения в базе данных
    image_url = f"images/{image.filename}"
    db.execute(update(model).where(model.user_id == current_user.id).values({image_field: image_url}))
    await db.commit()

    return {"message": f"{image_field} uploaded successfully"}


'''  ATHLETE  '''

@app.post("/upload-athlete-photo")
async def upload_athlete_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Athlete, "photo_url", image, current_user, user_manager, db)


@app.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 2:  # это типа спортсмен
        raise HTTPException(status_code=403,
                            detail="Only athletes can update their profile"
                            )

    await user_manager.update_athlete_profile(
        current_user, athlete_data
    )

    return {"message": "Athlete profile updated successfully"}


'''  SPECTATOR  '''

@app.post("/upload-spectator-photo")
async def upload_spectator_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Spectator, "photo_url", image, current_user, user_manager, db)


@app.put("/update-spectator-profile")
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 4:  # это типа зритель
        raise HTTPException(status_code=403, detail="Only spectator can update their profile")

    await user_manager.update_spectator_profile(
        current_user, spectator_data
    )

    return {"message": "Spectator profile updated successfully"}


'''  SYSADMIN  '''

@app.post("/upload-sysadmin-photo")
async def upload_sysadmin_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(SystemAdministrator, "photo_url", image, current_user, user_manager, db)


@app.put("/update-sysadmin-profile")
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 5:  # это типа сисадмин
        raise HTTPException(status_code=403, detail="Only sysadmin can update their profile")

    updated_sysadmin = await user_manager.update_sysadmin_profile(
        current_user, sysadmin_data
    )

    return {"message": "Sysadmin profile updated successfully"}


'''  ORGANIZER  '''

@app.post("/upload-organizer-photo")
async def upload_organizer_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(EventOrganizer, "logo_url", image, current_user, user_manager, db)


@app.put("/update-organizer-profile")
async def update_organizer_profile(
    organizer_data: organizer_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 3:  # это типа организатор
        raise HTTPException(status_code=403, detail="Only organizer can update their profile")

    await user_manager.update_organizer_profile(
        current_user, organizer_data
    )

    return {"message": "Organizer profile updated successfully"}


'''  TEAM  '''



'''  ---  '''


@app.get("/verify/{token}")
async def verify_user(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User.email).where(
        User.verification_token == token)
    )
    email = result.scalars().first()
    await db.execute(update(User).where(
        User.email == email).values(is_verified=True)
    )
    await db.commit()
    return {"email": email}

