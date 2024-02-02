from typing import Optional
from pydantic import BaseModel


class TeamSchemasBase(BaseModel):
    id: Optional[int]
    captain: Optional[int]
    name: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    logo_url: Optional[str]
    invite_link: Optional[str]


class TeamSchemasCreate(TeamSchemasBase):
    id: Optional[int]
    captain: Optional[int]
    name: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    logo_url: Optional[str]
    invite_link: Optional[str]

    class Config:
        orm_mode = True


class Team(TeamSchemasBase):
    id: Optional[int]
    captain: Optional[int]
    name: Optional[str]

    class Config:
        orm_mode = True
