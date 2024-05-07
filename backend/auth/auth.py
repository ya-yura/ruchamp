from fastapi import FastAPI
from fastapi_users.authentication import (AuthenticationBackend,
                                          BearerTransport, CookieTransport,
                                          JWTStrategy)

from config import SECRET

app = FastAPI()
cookie_transport = CookieTransport(
    cookie_name="ruchamp",
    cookie_max_age=360000
)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


@app.middleware("http")
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=360000)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    #transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
