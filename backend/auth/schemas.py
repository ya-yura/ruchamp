from datetime import date
from typing import List, Optional

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    username: str
    name: str
    sirname: str
    fathername: str
    gender: bool
    birthdate: date
    role_id: int
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    name: Optional[str] = None
    sirname: Optional[str] = None
    fathername: Optional[str] = None
    gender: Optional[bool] = True
    birthdate: Optional[date] = None
    password: str
    role_id: int
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class UserData(BaseModel):
    info: Optional[dict] = None


class User(schemas.BaseUser):
    pass


class UserUpdate(BaseModel):
    username: str
    name: str
    sirname: str
    fathername: str
    country: str


class UserDB(User, schemas.BaseUser):
    username: str
    email: str
    verification_token: str

    class Config:
        from_attributes = True


class AthleteUpdate(BaseModel):
    weight_category: Optional[str]
    belt_rank: Optional[str]
    coach_name: Optional[str]
    height: Optional[str]
    image_field: Optional[str]
    combat_types: Optional[List[str]]
    coaches: Optional[List[str]]


class SpectatorUpdate(BaseModel):
    phone_number: Optional[str]
    image_field: Optional[str]


class SysAdminUpdate(BaseModel):
    phone_number: Optional[str]
    image_field: Optional[str]


class OrganizerUpdate(BaseModel):
    organization_name: Optional[str]
    website: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    description: Optional[str]
    image_field: Optional[str]


class RefereeUpdate(BaseModel):
    qualification_level: Optional[str]
    image_field: Optional[str]
