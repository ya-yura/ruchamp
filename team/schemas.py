from typing import Optional
from pydantic import BaseModel


class TeamSchemasBase(BaseModel):
    id: int
    captain: int
    name: str
    description: str
    slug: str
    logo_url: str
    invite_link: str


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
    id: int
    captain: int
    name: str
    description: str
    slug: str
    logo_url: str
    invite_link: str

    class Config:
        orm_mode = True
