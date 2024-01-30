from fastapi_users import fastapi_users, FastAPIUsers
from fastapi import FastAPI, Depends, HTTPException

from auth.auth import auth_backend
from auth.models import User
from auth.manager import get_user_manager, UserManager
from auth.schemas import UserRead, UserCreate, AthleteUpdate, SpectatorUpdate, SysAdminUpdate, OrganizerUpdate

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


spectator_update = SpectatorUpdate

@app.put("/update-spectator-profile")
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 4:  # это типа зритель
        raise HTTPException(status_code=403, detail="Only spectator can update their profile")

    updated_spectator = await user_manager.update_spectator_profile(
        current_user, spectator_data
    )

    return {"message": "Spectator profile updated successfully"}


sysadmin_update = SysAdminUpdate

@app.put("/update-sysadmin-profile")
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 5:  # это типа сисадмин
        raise HTTPException(status_code=403, detail="Only sysadmin can update their profile")

    updated_sysadmin = await user_manager.update_sysadmin_profile(
        current_user, sysadmin_data
    )

    return {"message": "Sysadmin profile updated successfully"}


organizer_update = OrganizerUpdate

@app.put("/update-organizer-profile")
async def update_organizer_profile(
    organizer_data: organizer_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if current_user.role_id != 3:  # это типа организатор
        raise HTTPException(status_code=403, detail="Only organizer can update their profile")

    updated_organizer = await user_manager.update_organizer_profile(
        current_user, organizer_data
    )

    return {"message": "Organizer profile updated successfully"}
