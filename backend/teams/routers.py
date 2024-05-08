import os
from typing import Type
import uuid
from aiofiles import open as async_open

from fastapi import (APIRouter, Depends, File, HTTPException,
                     UploadFile)
from fastapi_pagination import Params, add_pagination, paginate
# from fastapi_pagination.utils import disable_installed_extensions_check
from fastapi_users import FastAPIUsers
from sqlalchemy import delete, select, update, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.ext.declarative import DeclarativeMeta

from auth.auth import auth_backend
from auth.manager import UserManager, get_user_manager
from auth.models import User, Athlete
# from auth.routes import router as auth_router
from auth.schemas import AthleteUpdate, UserDB
from connection import get_db
from teams.models import Team, TeamMember
from teams.schemas import TeamCreate, TeamUpdate

router = APIRouter(prefix="/team", tags=["Teams"])

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user()

athlete_update = AthleteUpdate
team_update = TeamUpdate
user_db_verify = UserDB

add_pagination(router)


def is_model_field(model: Type[DeclarativeMeta], field_name: str) -> bool:
    """
    Проверяет, существует ли атрибут с указанным именем в модели.
    """
    if hasattr(model, field_name):
        attribute = getattr(model, field_name)
        # Проверяем, является ли атрибут полем или связью
        return isinstance(attribute, (InstrumentedAttribute))
    return False


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
    allowed_roles = [1, 2, 4, 5]  # Роли, которым разрешено загружать изображения

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

    await db.commit()
    return team_id


'''  TEAM  '''


@router.post("/upload-team-photo/{team_id}")
async def upload_team_photo(
    team_id: int,
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Team).where(Team.id == team_id))
    team = query.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    query = await db.execute(select(
        TeamMember.member).where(TeamMember.team == team_id)
    )
    members = query.scalars().all()
    if current_user.id not in members:
        raise HTTPException(status_code=403, detail="Permission: denied")

    if image.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=406,
                            detail="Only .jpeg or .png files allowed")

    image_name = f"{uuid.uuid4().hex}.{image.filename.split('.')[-1]}"
    image_path = os.path.join("static/team", image_name)

    # Создаем директорию, если она не существует
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    async with async_open(image_path, "wb") as f:
        await f.write(await image.read())

    team.image_field = f"/static/team/{image_name}"
    await db.commit()

    return {f"Team {team.name} - updated"}


@router.put("/update-team-profile/{team_id}")
async def update_team_profile(
    team_id: int,
    team_data: TeamUpdate,
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Team.captain).where(Team.id == team_id))
    captains = query.scalars().all()
    try:
        if current_user.id in captains:
            await db.execute(update(Team).where(
                Team.id == team_id).values(team_data.dict()))
            await db.commit()
    except Exception:
        raise HTTPException(status_code=403, detail="Permission: denied")

    return {f"Team {team_data.name} - updated"}


@router.post("/create")
async def create_team(
    team_data: TeamCreate,
    current_user: UserDB = Depends(current_user),
    # user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Athlete.id).where(Athlete.user_id == current_user.id))
    athlete_id = query.scalar_one_or_none()

    role_id = current_user.role_id
    allowed_roles = [1, 2, 4]  # Роли, которым разрешено создавать команды

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    # Добавить создание ссылки на вступление в команду

    query = await db.execute(select(Team.name))
    all_teams_names = query.scalars().all()
    query = await db.execute(select(Team.captain))
    all_teams_capitans = query.scalars().all()

    if team_data.name in all_teams_names and current_user.id in all_teams_capitans:
        raise HTTPException(status_code=403, detail="Такое название команды и капитан уже существуют")

    # Создаем команду
    new_team = Team(
        **team_data.dict(),
        invite_link="123/link",  # добавить функцию генерации ссылки
        captain=athlete_id
    )
    db.add(new_team)
    await db.commit()

    await db.execute(insert(TeamMember).values(
        team=new_team.id, member=athlete_id))
    await db.commit()

    return {"message": f"Team: {new_team.name} - created"}


@router.get("/get-all-teams")
async def get_all_teams(
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Team))
    teams = query.scalars().all()
    return teams

# disable_installed_extensions_check()
# add_pagination(router)


@router.get("/get-team/{team_id}")
async def get_team(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    team = await db.execute(select(Team).where(Team.id == team_id))
    return team.scalars().first()


@router.get("/get-team-members/{team_id}")
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


@router.post("/join-team/{team_id}")
async def join_team(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))
    team_members = query.scalars().all()

    if current_user.id in team_members:
        raise HTTPException(
            status_code=400, detail="You are already a member of this team")

    if team_id is None:
        raise HTTPException(status_code=404, detail="Team not found")

    await db.execute(TeamMember.__table__.insert().values(
        team=team_id, member=current_user.id))

    await db.commit()
    return {"message": "Team joined successfully"}


@router.post("/change_captain/{team_id}")
async def change_captain(
    team_id: int,
    id_member: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    team = await db.execute(select(Team.id).where(
        Team.id == team_id and Team.captain == current_user.id))

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


@router.post("/delete-member-team/{team_id}")
async def delete_member_team(
    team_id: int,
    member_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
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
