from connection import get_db
from typing import Type

from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi_pagination import paginate, add_pagination, Params
from fastapi_pagination.utils import disable_installed_extensions_check
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute

from auth.auth import auth_backend
from auth.models import (
    User,
    Team,
    TeamMember
)
from auth.manager import (
    get_user_manager,
    UserManager,
)
from auth.schemas import (
    UserRead,
    UserCreate,
    AthleteUpdate,
    UserDB,
    TeamUpdate,
    TeamCreate,
)
from auth.routes import router as auth_router



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

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(auth_router, prefix="/user")


current_user = fastapi_users.current_user()

athlete_update = AthleteUpdate
team_update = TeamUpdate
user_db_verify = UserDB


def is_model_field(model: Type, field_name: str) -> bool:
    """
    Проверяет, существует ли атрибут с указанным именем в модели.
    """
    return isinstance(getattr(model, field_name, None), InstrumentedAttribute)



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


async def create_team_and_members(
    db: AsyncSession,
    team_data: TeamCreate,
    captain_user: UserDB
) -> int:

    # Создаем команду
    team_dict = team_data.dict()
    team_dict["captain"] = captain_user.id
    await db.execute(Team.__table__.insert().values(team_dict))
    team_in_db = await db.execute(select(Team.id).where(
        Team.captain == captain_user.id))

    team_id = team_in_db.scalars().first()

    # Добавляем капитана в список членов команды
    await db.execute(TeamMember.__table__.insert().values(
        team=team_id, member=captain_user.id))

    # Добавляем остальных участников
    # for member in team_data.members:
    #     await db.execute(TeamMember.__table__.insert().values(
    #         team=team_id, member=member.member_id))

    await db.commit()
    return team_id




'''  TEAM  '''


@app.post("/upload-team-photo", tags=["teams"])
async def upload_team_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Team, "image_field", image, current_user, db)


@app.put("/update-team-profile", tags=["teams"])
async def update_team_profile(
    team_data: team_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Team, team_data, current_user, user_manager)


@app.post("/create-team", tags=["teams"])
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


@app.get("/get-all-teams", tags=["teams"])
async def get_all_teams(
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
    params: Params = Depends(),
):
    teams = await db.execute(select(Team))
    return paginate(teams.mappings().all(), params)

disable_installed_extensions_check()
add_pagination(app)


@app.get("/get-team/{team_id}", tags=["teams"])
async def get_team(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    team = await db.execute(select(Team).where(Team.id == team_id))
    return team.mappings().first()


@app.get("/get-team-members/{team_id}", tags=["teams"])
# Участники команды
async def get_team_members(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
    params: Params = Depends(),
):
    team_members = await db.execute(select(TeamMember).where(
        TeamMember.team == team_id))

    return paginate(team_members.mappings().all(), params)


@app.post("/join-team/{team_uuid}", tags=["teams"])
async def join_team(
    team_uuid: str,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    team = await db.execute(select(Team.id).where(
        Team.invite_link == team_uuid))
    team_id = team.scalars().first()
    team_members_db = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))

    team_members = team_members_db.scalars().all()
    if current_user.id in team_members:
        raise HTTPException(
            status_code=400, detail="You are already a member of this team")

    if team_id is None:
        raise HTTPException(status_code=404, detail="Team not found")

    await db.execute(TeamMember.__table__.insert().values(
        team=team_id, member=current_user.id))

    await db.commit()
    return {"message": "Team joined successfully"}


@app.post("/change_captain", tags=["teams"])
async def change_captain(
    id_member: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    team = await db.execute(select(Team.id).where(
        Team.captain == current_user.id))

    team_id = team.scalars().one()

    team_members_db = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))

    team_members = team_members_db.scalars().all()
    if id_member not in team_members:
        raise HTTPException(
            status_code=400, detail="Member is not a member of this team")

    await db.execute(update(Team).where(
        Team.id == team_id).values(captain=id_member))
    await db.commit()
    return {"message": "Captain changed successfully"}


@app.post("/delete-member-team", tags=["teams"])
async def delete_member_team(
    member_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(TeamMember.team).where(
        TeamMember.member == current_user.id))

    team_id = query.scalars().one()

    team_members_db = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))

    team_members = team_members_db.scalars().all()

    team_cap = await db.execute(select(Team.captain).where(Team.id == team_id))
    team_cap_id = team_cap.scalars().one()

    if member_id not in team_members:
        raise HTTPException(
            status_code=400, detail="Member is not a member of this team")

    if member_id == team_cap_id:
        raise HTTPException(
            status_code=400, detail="Captain can't leave the team")
    else:
        await db.execute(delete(TeamMember).where(
            TeamMember.member == member_id))
        await db.commit()
        return {"message": "Member deleted successfully"}
