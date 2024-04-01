from fastapi_users.authentication import CookieTransport, AuthenticationBackend
from fastapi_users.authentication import JWTStrategy, BearerTransport

from config import SECRET
from fastapi import FastAPI

app = FastAPI()
cookie_transport = CookieTransport(cookie_name="ruchamp", cookie_max_age=3600)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


@app.middleware("http")
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt",
    # transport=bearer_transport,
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
