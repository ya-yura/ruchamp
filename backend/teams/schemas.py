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


class TeamUpdate(BaseModel):
    name: Optional[str]
    invite_link: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    image_field: Optional[str]


class TeamDB(TeamCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
