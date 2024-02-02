from auth.database import async_session_maker

from sqlalchemy import select, update, insert
from fastapi_pagination.ext.sqlalchemy import paginate


class BaseServicesTeam:
    model = None

    @classmethod
    async def get_teams_all(cls):
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
    async def create_team(cls, **team):
        async with async_session_maker() as session:
            query = insert(cls.model).values(**team)
            result = await session.execute(query)
            await session.commit()
            return result

    @classmethod
    async def update_team(cls, id, **team):
        async with async_session_maker() as session:
            update_query = update(cls.model).filter_by(
                id=id).values(**team)
            await session.execute(update_query)
            await session.commit()
