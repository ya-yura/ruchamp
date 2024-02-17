import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert, delete

from connection import get_db
from event.models import Event, Match, MatchResult, Participant, MatchPeriod
from auth.models import User, Athlete, AllWeightClass, CategoryType
from teams.models import TeamMember
from match.models import TempDrawParticipants, AgeCategory
from match.utils import split_pairs, pairs_generator


router = APIRouter(prefix="/api", tags=["Matchs"])


@router.get("/matchs")
async def get_matchs(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match))
    return query.scalars().all()


@router.get("/matchs/{id}")
async def get_match(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match).where(Match.id == id))
    return query.scalars().one_or_none()


@router.post("/matchs/update")
async def update_match(db: AsyncSession = Depends(get_db)):
    pass


@router.get("/matchs/draw/{event_id}")
async def temp_participants(event_id: int, db: AsyncSession = Depends(get_db)):

    # Очищаем данные из таблицы
    await db.execute(delete(TempDrawParticipants))
    # Незабыть удалить
    await db.execute(delete(Match))
    await db.commit()

    query = await db.execute(select(Participant.player_id).where(
        Participant.event_id == event_id))
    participants = query.scalars().all()

    members = []

    for member in participants:

        query = await db.execute(select(TeamMember.member).where(
            TeamMember.id == member))
        member = query.scalars().one()

        await db.execute(insert(TempDrawParticipants).values(
            athlete_id=member))
        members.append(member)

        for member in members:
            query = await db.execute(select(Athlete.weight).where(
                Athlete.id == member))
            weight = int(query.scalars().one())

            if weight >= 39 and weight <= 60:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        weight_category=1))

            if weight >= 61 and weight <= 75:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        weight_category=2))

            if weight >= 76 and weight <= 90:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        weight_category=3))

            if weight >= 91 and weight <= 100:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        weight_category=4))

            if weight >= 101 and weight <= 151:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        weight_category=5))

            query = await db.execute(select(Athlete.user_id).where(
                Athlete.id == member))
            user_id = query.scalars().one()

            query = await db.execute(select(User.birthdate).where(
                User.id == user_id))

            user_year = query.scalars().one()
            user_year = user_year.year
            age_player = datetime.datetime.now().year - user_year

            if age_player >= 10 and age_player <= 12:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=1))

            if age_player >= 13 and age_player <= 14:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=2))

            if age_player >= 15 and age_player <= 16:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=3))

            if age_player >= 17 and age_player <= 18:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=4))

            if age_player >= 19 and age_player <= 20:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=5))

            if age_player >= 21 and age_player <= 34:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=6))

            if age_player >= 35 and age_player <= 99:
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == member).values(
                        age_category=7))

    await db.execute(update(TempDrawParticipants).values(grade_category=10))
    await db.commit()

    query = await db.execute(select(AgeCategory))
    age = query.scalars().all()
    ages = len(age)
    query = await db.execute(select(AllWeightClass))
    weight = query.scalars().all()
    weights = len(weight)
    query = await db.execute(select(CategoryType))
    grade = query.scalars().all()
    grades = len(grade)

    all_pairs = {}

    for grade in range(1, grades + 1):
        for weight in range(1, weights + 1):
            for age in range(1, ages + 1):

                query = await db.execute(select(
                    TempDrawParticipants.athlete_id).filter_by(
                        weight_category=weight,
                        age_category=age,
                        grade_category=grade))
                athletes = query.scalars().all()

                if len(athletes) == 0:
                    continue
                all_pairs.update({(weight, age, grade): athletes})

    combat_pairs = []
    pairs = list([*all_pairs.values()])

    # В таблице Ивент надо поле CombatType сделать Integer, чтоб хранить ссылку ID CombatType
    query = await db.execute(select(Event.event_system).where(
        Event.id == event_id))
    combat_type = query.scalars().one()

    for pair in pairs:
        # здесь поменять на ID CombatType
        if combat_type in 'Single elimination (Олимпийская система)':
            combat_pairs.append(split_pairs(list(pair)))
        if combat_type in 'Round robin (Круговая система)':
            combat_pairs.append(pairs_generator(pair))

    for pairs in combat_pairs:
        for pair in pairs:
            if pair[1] == '':
                await db.execute(insert(Match).values(
                    event_id=event_id,
                    combat_type_id=1,
                    category_id=1,
                    weight_class_id=1,
                    round=1,
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=38,
                    winner_id=pair[0]
                ))
            else:
                await db.execute(insert(Match).values(
                    event_id=event_id,
                    combat_type_id=1,
                    category_id=1,
                    weight_class_id=1,
                    round=1,
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=pair[1]
                ))
            await db.commit()

    return {'Участники': pairs, 'Пары для спаринга': combat_pairs}
