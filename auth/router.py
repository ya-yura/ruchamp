from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext

from auth.services import UserServices


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


@router.get("")
async def get_users_all():
    return await UserServices.get_users_all()


@router.get("/{id}")
async def get_user_by_id(id: int):
    user = await UserServices.find_one_or_none(id=id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found"
                            )
    return user


@router.put("/{id}")
async def update_user(id: int, user: dict):
    updated_user = await UserServices.update_one(id, user)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found"
                            )
    return updated_user


@router.get("/verify/{token}")
async def verify_user(token: str):
    user = await UserServices.find_one_or_none(verification_token=token)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found"
                            )
    await UserServices.update_verify(verification_token=token)
    await UserServices.update_token(verification_token=token)
    return f"User verified"
