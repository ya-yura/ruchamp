from fastapi import FastAPI
from fastapi_users import FastAPIUsers

from auth.auth import auth_backend
from auth.models import (
    User,
)
from auth.manager import (
    get_user_manager,
)
from auth.schemas import (
    UserRead,
    UserCreate,
)
from auth.routes import router as auth_router
from pages.router import router as pages_router
from event.routers import router as event_router
from teams.routers import router as team_router
from match.routers import router as match_router


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

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)


app.include_router(pages_router)
app.include_router(auth_router)
app.include_router(event_router)
app.include_router(team_router)
app.include_router(match_router)
