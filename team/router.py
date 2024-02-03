from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import paginate, add_pagination, Params
from fastapi_pagination.utils import disable_installed_extensions_check
from fastapi_users import FastAPIUsers
import uuid

from auth.manager import get_user_manager
from auth.auth import auth_backend
from team.services import TeamServices
from team.schemas import TeamSchemasBase, TeamSchemasCreate, Team
from auth.database import get_async_session
from auth.models import TeamMember, User
from sqlalchemy import update, select


router = APIRouter(
    prefix="/team",
    tags=["Teams"]
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user()


@router.get("")
async def get_teams_all(params: Params = Depends()):
    return paginate(await TeamServices.get_teams_all(), params)

disable_installed_extensions_check()
add_pagination(router)


@router.get("/{id}")
async def get_team_by_id(id: int):
    team = await TeamServices.find_one_or_none(id=id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Team not found"
                            )
    return team


@router.post("/create_team", response_model=TeamSchemasBase)
async def create_team(
    team: TeamSchemasCreate,
):
    team_dict = team.dict(exclude_unset=True)
    team_name = await TeamServices.find_one_or_none(name=team.name)
    team_id = await TeamServices.find_one_or_none(id=team.id)
    if team_name:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Team already exists"
                            )
    if team_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Team already exists"
                            )
    await TeamServices.create_team(**team_dict)
    return f"team created {team.name}"


@router.put("/team/{id}", response_model=Team)
async def update_team(
    id: int,
    team: Team,
    session: AsyncSession = Depends(get_async_session)
):
    team_dict = team.dict(exclude_unset=True)
    team_id = await TeamServices.find_one_or_none(id=id)
    if not team_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Team not found"
                            )
    await TeamServices.update_team(**team_dict)
    return f"team {id} updated"


@ router.post("/join_team/{id}")
async def join_team(
    team_id: int,
    current_user: User = Depends(current_user),
    session: AsyncSession = Depends(get_async_session)
):
    team_id_db = await TeamServices.find_one_or_none(id=team_id)
    if not team_id_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Team not found"
                            )
    try:
        await session.execute(update(TeamMember).values(id=uuid.uuid4(), team=team_id, member=current_user.id))
        await session.commit()
        return {"message": "User joined the team"}
    except Exception as e:
        return {"message": str(e)}
