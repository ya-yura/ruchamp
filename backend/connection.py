from auth.models import User
from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
Base: DeclarativeMeta = declarative_base()


async def get_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()


async def get_async_session():
    async with SessionLocal() as session:
        yield session


async def get_user_db(session=Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
