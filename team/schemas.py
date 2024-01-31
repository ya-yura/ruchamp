from typing import Optional
from pydantic import BaseModel


class TeamSchemas(BaseModel):
    id: int
    captain: Optional[int]  # создавать команду может только User? или Организатор и админ тоже?
    name: Optional[str]
    invite_link: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    logo_url: Optional[str]

    class Config:
        orm_mode = True
