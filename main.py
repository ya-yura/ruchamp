from fastapi_users import FastAPIUsers
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from auth.auth import auth_backend
from auth.models import User
from auth.manager import get_user_manager, UserManager, get_hash_password
from auth.schemas import UserRead, UserCreate, AthleteUpdate
from auth.mailer import send_forgot_password_email
from auth.router import router as router_users
from team.router import router as router_teams
from connection import get_db
import uuid


app = FastAPI(
    title="Ruchamp"
)


fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api",
    tags=["auth"],
)

app.include_router(router_users)
app.include_router(router_teams)


current_user = fastapi_users.current_user()

athlete_update = AthleteUpdate


@app.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 2:  # это типа спортсмен
        raise HTTPException(status_code=403,
                            detail="Only athletes can update their profile"
                            )

    updated_athlete = await user_manager.update_athlete_profile(
        current_user, athlete_data
    )

    return {"message": "Athlete profile updated successfully"}


@app.post("/forgot-password/{email}")
async def forgot_password(email: str, db: AsyncSession = Depends(get_db)):
    email_db = await db.execute(select(User.email).where(
        User.email == email)
    )
    user_email = email_db.scalars().first()
    if user_email is None:
        raise HTTPException(status_code=404,
                            detail="User not found"
                            )
    username_db = await db.execute(select(User.username).where(
        User.email == email)
    )
    username = username_db.scalars().first()
    token = str(uuid.uuid4())
    send_forgot_password_email(username, user_email, token)
    await db.execute(update(User).where(
        User.email == user_email).values(verification_token=token)
    )
    await db.commit()
    return {"message": "Verification token sent to your email"}


@app.get("/change-password/{token}")
async def change_password(token: str,
                          password: str,
                          db: AsyncSession = Depends(get_db)
                          ):
    await db.execute(update(User).where(
        User.verification_token == token).values(
            hashed_password=get_hash_password(password)))  # при логировании под новым паролем ошибка
    await db.commit()
    return {"message": "Password changed"}


'''
При логировании под новым паролем ошибка
@app.post("/change-password")
async def change_password2(
    new_password: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User.email).where(
        User.verification_token == token)
    )
    email = result.scalars().first()
    await db.execute(update(User).where(
        User.email == email).values(verification_token="")
    )
    await db.execute(update(User).where(
        User.email == email).values(hashed_password="abc"))
    new_pwd = get_hash_password(new_password)
    print(new_pwd)
    await db.execute(update(User).values(hashed_password=new_pwd))
    await db.commit()
    return {"message": "Password changed"}
'''
