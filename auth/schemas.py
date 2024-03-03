from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    username: str
    name: str
    sirname: str
    fathername: str
    gender: bool
    country: str
    birthdate: datetime
    role_id: int
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    name: str
    sirname: str
    fathername: str
    gender: bool
    country: str
    birthdate: datetime
    password: str
    role_id: int
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class UserUpdate(schemas.BaseUserUpdate):
    pass


class User(schemas.BaseUser):
    pass


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
# Тренеры и типы используют List[str], им надо передавать списки строк,
# представляющих имена видов борьбы и тренеров соответственно.


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
