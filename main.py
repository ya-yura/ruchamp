from fastapi_users import FastAPIUsers, fastapi_users
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute
from auth.auth import auth_backend
from auth.models import (
    User,
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
    Team,
    TeamMember
)
from auth.manager import get_user_manager, UserManager
from auth.schemas import (
    UserRead,
    UserCreate,
    AthleteUpdate,
    UserDB,
    SpectatorUpdate,
    SysAdminUpdate,
    OrganizerUpdate,
    TeamUpdate,
    TeamCreate,
    TeamDB
)
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
team_update = TeamUpdate
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
        raise HTTPException(status_code=400, detail="Invalid image field for the model")

    with open(f"images/{image.filename}", "wb") as f:
        f.write(image.file.read())

    image_url = f"images/{image.filename}"
    db.execute(update(model).where(model.user_id == current_user.id).values({image_field: image_url}))
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

@app.post("/upload-athlete-photo")
async def upload_athlete_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Athlete, "photo_url", image, current_user, db)

@app.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Athlete, athlete_data, current_user, user_manager)


'''  SPECTATOR  '''

@app.post("/upload-spectator-photo")
async def upload_spectator_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Spectator, "photo_url", image, current_user, db)

@app.put("/update-spectator-profile")
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Spectator, spectator_data, current_user, user_manager)


'''  SYSADMIN  '''

@app.post("/upload-sysadmin-photo")
async def upload_sysadmin_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(SystemAdministrator, "photo_url", image, current_user, db)

@app.put("/update-sysadmin-profile")
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(SystemAdministrator, sysadmin_data, current_user, user_manager)


'''  ORGANIZER  '''

@app.post("/upload-organizer-photo")
async def upload_organizer_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(EventOrganizer, "logo_url", image, current_user, db)

@app.put("/update-organizer-profile")
async def update_organizer_profile(
    organizer_data: organizer_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(EventOrganizer, organizer_data, current_user, user_manager)


'''  TEAM  '''

@app.post("/upload-team-photo")
async def upload_team_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Team, "image_field", image, current_user, db)

@app.put("/update-team-profile")
async def update_team_profile(
    team_data: team_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Team, team_data, current_user, user_manager)


@app.post("/create-team")
async def create_team(
    team_data: TeamCreate,
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    role_id = current_user.role_id
    allowed_roles = [2, 3, 4, 5]  # Роли, которым разрешено создавать команды

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    # Создаем команду
    team_id = await create_team_and_members(db, team_data, current_user)

    return {"message": "Team created successfully", "team_id": team_id}


async def create_team_and_members(db: AsyncSession, team_data: TeamCreate, captain_user: UserDB) -> int:
    # Создаем команду
    team_dict = team_data.dict()
    team_dict["captain"] = captain_user.id
    team = await db.execute(Team.__table__.insert().values(team_dict))
    team_id = team.scalars().first()

    # Добавляем капитана в список членов команды
    await db.execute(TeamMember.__table__.insert().values(team_id=team_id, member_id=captain_user.id))

    # Добавляем остальных участников
    for member in team_data.members:
        await db.execute(TeamMember.__table__.insert().values(team_id=team_id, member_id=member.member_id))

    await db.commit()
    return team_id


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

