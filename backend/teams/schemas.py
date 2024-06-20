from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TeamMember(BaseModel):
    team: int
    member: int


class TeamCreate(BaseModel):
    name: str
    description: Optional[str]
    slug: Optional[str]
    image_field: Optional[str]
    country: Optional[int]
    city: Optional[str]
    region: Optional[int]


class TeamUpdate(BaseModel):
    name: Optional[str]
    invite_link: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    image_field: Optional[str]
    country: Optional[int]
    city: Optional[str]
    region: Optional[int]


class TeamDB(TeamCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Participant(BaseModel):
    match_id: int
    player_id: int
    team_id: Optional[int]

    class Config:
        from_attributes = True

class Message(BaseModel):
    message: str