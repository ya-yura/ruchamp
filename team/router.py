from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
import json
from fastapi_pagination import Page, add_pagination, paginate
from fastapi_pagination.ext.sqlalchemy import paginate as paginate_db

from team.services import TeamServices
from team.schemas import TeamSchemasBase, TeamSchemasCreate, Team
from auth.database import get_async_session


router = APIRouter(
    prefix="/team",
    tags=["Teams"]
)


@router.get("")
async def get_teams_all():
    await TeamServices.get_teams_all()
    return


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
    return f"team created"


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

