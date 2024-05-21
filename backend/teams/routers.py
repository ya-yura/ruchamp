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
from auth.models import (User, Athlete, athlete_coach_association, Coach,
                         SportType, athlete_sport_type_association)
# from auth.routes import router as auth_router
from auth.schemas import AthleteUpdate, UserDB
from connection import get_db
from teams.models import Team, TeamMember
from teams.schemas import TeamCreate, TeamUpdate, Participant
from event.models import MatchParticipant

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

    # Роли, которым разрешено загружать изображения
    allowed_roles = [1, 2, 4, 5]

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
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalar_one_or_none()

    query = await db.execute(select(Team).where(Team.id == team_id))
    team = query.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    query = await db.execute(select(
        TeamMember.member).where(TeamMember.team == team_id)
    )
    members = query.scalars().all()
    if athlete_id not in members:
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
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalar_one_or_none()

    query = await db.execute(select(Team.captain).where(Team.id == team_id))
    captains = query.scalars().all()
    try:
        if athlete_id in captains:
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
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalars().first()

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
        raise HTTPException(
            status_code=403,
            detail="Такое название команды и капитан уже существуют"
        )

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
    query = await db.execute(select(Team.id))
    teams_id = query.scalars().all()
    result = []
    for team_id in teams_id:
        query = await db.execute(select(
            Team.id,
            Team.name,
            Team.description,
            Team.slug,
            Team.invite_link,
            Team.image_field,
            Team.country,
            Team.city,
            Team.region,
        ).where(Team.id == team_id))
        team = query.mappings().all()

        query = await db.execute(
            select(Team.captain).where(Team.id == team_id)
        )
        captain_user_id = query.scalars().first()
        query = await db.execute(
            select(Athlete.user_id).where(Athlete.id == captain_user_id)
        )
        user_id = query.scalars().first()

        query = await db.execute(select(
            User.sirname,
            User.name,
            User.fathername,
        ).where(User.id == user_id))
        captain_info = query.mappings().all()

        query = await db.execute(
            select(TeamMember.member).where(TeamMember.team == team_id)
        )
        members = query.scalars().all()
        members_info = []
        for member in members:
            i = 0
            query = await db.execute(
                select(Athlete.user_id).where(Athlete.id == member)
            )
            user_id = query.scalars().first()

            query = await db.execute(select(
                User.sirname,
                User.name,
                User.fathername,
                User.birthdate,
                User.gender,
            ).where(User.id == user_id))
            user_info = query.mappings().all()

            query = await db.execute(select(
                Athlete.height,
                Athlete.weight,
                Athlete.country,
                Athlete.region,
                Athlete.city,
            ).where(Athlete.user_id == user_id))
            athlete = query.mappings().all()

            query = await db.execute(select(
                SportType.name
            ).join(
                athlete_sport_type_association
            ).where(athlete_sport_type_association.c.athlete_id == member))
            sport_types = query.scalars().all()

            user_info.append(athlete[i])
            user_info.append(sport_types)

            members_info.append(user_info)
            i += 1
        if captain_info:
            team.append(captain_info[0])
        else:
            continue
        team.append(members_info)
        result.append(team)

    return result


@router.get("/get-team/{team_id}")
async def get_team(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Team.captain).where(Team.id == team_id))
    athlete_id = query.scalars().first()

    query = await db.execute(select(
        Athlete.user_id
    ).where(Athlete.id == athlete_id))
    captain_user_id = query.scalars().first()

    query = await db.execute(select(
        User.id.label("user_id")
    ).where(User.id == captain_user_id))
    captain_info = query.mappings().all()

    query = await db.execute(select(
        Team.id,
        Team.name,
        Team.image_field,
        Team.description,
        Team.invite_link,
        Team.slug,
        Team.country,
        Team.city,
        Team.region,
    ).where(Team.id == team_id))
    team_info = query.mappings().all()

    if not team_info:
        raise HTTPException(status_code=404, detail="Team not found")

    team = team_info

    query = await db.execute(select(
        TeamMember.member).where(TeamMember.team == team_id)
    )
    members = query.scalars().all()
    users = []

    for member in members:
        query = await db.execute(select(Athlete.user_id)
                                 .where(Athlete.id == member))
        athlete_id = query.scalar_one_or_none()

        query = await db.execute(select(
            User.id,
            User.sirname,
            User.name,
            User.fathername,
            User.birthdate,
            User.gender
        ).where(User.id == athlete_id))
        user = query.mappings().all()

        query = await db.execute(select(
            Athlete.height,
            Athlete.weight,
            Athlete.image_field,
            Athlete.country,
            Athlete.city,
            Athlete.region,
        ).where(Athlete.id == member))
        athlete = query.mappings().all()

        query = await db.execute(select(
            SportType.name
        ).join(
            athlete_sport_type_association
        ).where(athlete_sport_type_association.c.athlete_id == member))
        sport_types = query.scalars().all()

        query = await db.execute(select(
            Coach.sirname,
            Coach.name,
            Coach.fathername,
            Coach.qualification_level
        ).join(
            athlete_coach_association
        ).where(athlete_coach_association.c.athlete_id == member))
        coachs = query.mappings().all()

        user.append(athlete[0])
        user.append(sport_types)
        user.append(coachs[0])
        users.append(user)

    result = {"Team": team[0], "Captain": captain_info[0], "Members": users}

    return result


@router.get("/get-team-members/{team_id}")
# Участники команды
async def get_team_members(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(TeamMember).where(
        TeamMember.team == team_id))
    team_members = query.mappings().all()

    return team_members


@router.post("/join-team/{team_id}")
async def join_team(
    team_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalar_one_or_none()

    query = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))
    team_members = query.scalars().all()

    if athlete_id in team_members:
        raise HTTPException(
            status_code=400, detail="You are already a member of this team")

    if team_id is None:
        raise HTTPException(status_code=404, detail="Team not found")

    await db.execute(TeamMember.__table__.insert().values(
        team=team_id, member=athlete_id))

    await db.commit()
    return {"message": "Team joined successfully"}


@router.post("/change-captain/{team_id}")
async def change_captain(
    team_id: int,
    member_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalar_one_or_none()

    query = await db.execute(select(Team.captain).where(Team.id == team_id))
    captain_id = query.scalar_one_or_none()
    print(athlete_id)
    print(captain_id)

    if athlete_id != captain_id:
        raise HTTPException(
            status_code=400,
            detail="You is not a capitan of this team"
        )

    query = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))
    team_members = query.scalars().all()

    if member_id not in team_members:
        raise HTTPException(
            status_code=400, detail="Member is not a member of this team")

    await db.execute(update(Team).where(
        Team.id == team_id).values(captain=member_id))
    await db.commit()

    return {"message": "Captain changed successfully"}


@router.delete("/delete-member-team/{team_id}")
async def delete_member_team(
    team_id: int,
    member_id: int,
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalar_one_or_none()

    query = await db.execute(select(TeamMember.member).where(
        TeamMember.team == team_id))

    team_members = query.scalars().all()

    team_cap = await db.execute(select(Team.captain).where(Team.id == team_id))
    team_cap_id = team_cap.scalars().one()

    if athlete_id != team_cap_id:
        raise HTTPException(
            status_code=400, detail="You not captain this team"
        )

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


@router.get("/rating/all-teams")
async def all_teams_rating(
    db: AsyncSession = Depends(get_db)
):
    result = {}
    teams_info = {}
    query = await db.execute(select(Team.id))
    teams = query.scalars().all()
    all_members = []
    for team in teams:
        query = await db.execute(select(TeamMember.member).where(TeamMember.team == team))
        members = query.scalars().all()
        all_members.append(members)
        result[team] = members
    for key, value in result.items():
        for member in value:
            query = await db.execute(select(Athlete.user_id).where(Athlete.id == member))
            users = query.scalars().all()
            for user_id in users:
                query = await db.execute(
                    select(
                        User.id,
                        User.name,
                        User.sirname,
                        User.fathername,
                        User.birthdate
                    )
                    .where(User.id == user_id)
                )
                user = query.mappings().all()

                teams_info.setdefault(key, []).append(user[0])
            
    '''all_users = []
    users = []
    for members in all_members:
        for member in members:
            query = await db.execute(select(Athlete.user_id).where(Athlete.id == member))
            user_id = query.scalars().first()
            users.append(user_id)
        all_users.append(users)'''
                                



    # print(teams)
    # print(all_members)
    # print(all_users)
    return teams_info
