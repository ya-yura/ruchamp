from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_users import FastAPIUsers
from fastapi.staticfiles import StaticFiles

from auth.auth import auth_backend
from auth.manager import get_user_manager
from auth.models import User
from auth.routes import router as auth_router
from auth.schemas import UserCreate, UserRead
from event.routers import router as event_router
from match.routers import router as match_router
from pages.router import router as pages_router
from shop.routers import router as shop_router
from teams.routers import router as team_router

# app = FastAPI(title="Ruchamp", docs_url=None, redoc_url=None)
app = FastAPI(title="Ruchamp")

# Подключение маршрута для статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)


# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    # "http://emely.myddns.me",
    # "http://emely.myddns.me:3000",
    "http://sportplatform.ru",
    "http://sportplatform.ru:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(auth_router)
app.include_router(event_router)
app.include_router(match_router)
app.include_router(team_router)
app.include_router(shop_router)
