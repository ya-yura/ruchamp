from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext

from team.services import TeamServices


router = APIRouter(
    prefix="/team",
    tags=["Teams"]
)


@router.get("")
async def get_teams_all():
    return await TeamServices.get_teams_all


@router.get("/{id}")
async def get_team_by_id(id: int):
    team = await TeamServices.find_one_or_none(id=id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Team not found"
                            )
    return team


@router.post("/create_team")
async def create_team(team: dict):
    return await TeamServices.create_team(team)
