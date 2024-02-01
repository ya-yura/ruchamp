from typing import Optional
from pydantic import BaseModel
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    username: str
    role_id: int
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        orm_mode = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
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
        orm_mode = True


class AthleteUpdate(BaseModel):
    weight_category: Optional[str]
    belt_rank: Optional[str]
    coach_name: Optional[str]
    birthdate: Optional[str]
    height: Optional[str]
    gender: Optional[str]
    country: Optional[str]
    image_field: Optional[str]


class SpectatorUpdate(BaseModel):
    full_name: Optional[str]
    gender: Optional[str]
    birthdate: Optional[str]
    country: Optional[str]
    phone_number: Optional[str]
    image_field: Optional[str]


class SysAdminUpdate(BaseModel):
    full_name: Optional[str]
    gender: Optional[str]
    birthdate: Optional[str]
    country: Optional[str]
    phone_number: Optional[str]
    image_field: Optional[str]


class OrganizerUpdate(BaseModel):
    organization_name: Optional[str]
    website: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    description: Optional[str]
    image_field: Optional[str]
