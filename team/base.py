from auth.database import async_session_maker

from sqlalchemy import select, update


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
    async def create_team(cls, team):
        async with async_session_maker() as session:
            session.add(team)
            await session.commit()
            return team

    @classmethod
    async def update_team(cls, team):
        async with async_session_maker() as session:
            update_query = update(cls.model).where(cls.model.id == team.id).values(**team.dict())
            await session.execute(update_query)
            await session.commit()
            return "team update"
