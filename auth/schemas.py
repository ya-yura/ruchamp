from typing import Optional
from pydantic import BaseModel
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    id: int
    username: str
    email: str
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
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None


'''
class UserDB(User, schemas.BaseUser):
    username: str
    email: str
    verification_token: str

    class Config:
        orm_mode = True


class UserChangePassword(schemas.BaseUserUpdate):
    current_password: str
    new_password: str
'''


class AthleteUpdate(BaseModel):
    weight_category: Optional[str]
    belt_rank: Optional[str]
    coach_name: Optional[str]
    birthdate: Optional[str]
    height: Optional[str]
    gender: Optional[str]
    country: Optional[str]
    photo_url: Optional[str]
