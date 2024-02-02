from auth.database import async_session_maker

from sqlalchemy import select, update


class BaseServices:
    model = None

    @classmethod
    async def get_users_all(cls):
        async with async_session_maker() as session:
            query = select(cls.model)
            result = await session.execute(query)
        return result.mappings().all()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def update_verify(cls, **filter_by):
        async with async_session_maker() as session:
            query = update(cls.model).filter_by(
                **filter_by).values(is_verified=True)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def update_token(cls, **filter_by):
        async with async_session_maker() as session:
            query = update(cls.model).filter_by(
                **filter_by).values(verification_token="")
            await session.execute(query)
            await session.commit()

    @classmethod
    async def update_password(cls, **filter_by):
        async with async_session_maker() as session:
            query = update(cls.model).values(**filter_by)
            await session.execute(query)
            await session.commit()
