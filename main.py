from fastapi_users import fastapi_users, FastAPIUsers
from fastapi import FastAPI, Depends, HTTPException

from auth.auth import auth_backend
from auth.models import User
from auth.manager import get_user_manager, UserManager
from auth.schemas import UserRead, UserCreate, AthleteUpdate

app = FastAPI(
    title="Ruchamp"
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

current_user = fastapi_users.current_user()

athlete_update = AthleteUpdate

@app.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 2:  # это типа спортсмен
        raise HTTPException(status_code=403, detail="Only athletes can update their profile")

    updated_athlete = await user_manager.update_athlete_profile(
        current_user, athlete_data
    )

    return {"message": "Athlete profile updated successfully"}