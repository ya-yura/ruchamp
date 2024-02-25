import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert, delete

from connection import get_db
from event.models import Event, Match, MatchResult, Participant, MatchPeriod
from auth.models import User, Athlete, AllWeightClass, CategoryType, Referee
from auth.schemas import UserDB
from auth.routes import current_user
from teams.models import TeamMember
from match.models import TempDrawParticipants, AgeCategory, TempAthlete, Score
from match.utils import split_pairs, pairs_generator
from fastapi import HTTPException
from match.schemas import MatchScore


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
    await db.execute(delete(TempAthlete))
    await db.execute(delete(Match))
    await db.commit()

    query = await db.execute(select(Participant.player_id).where(
        Participant.event_id == event_id))
    participants = query.scalars().all()

    query = await db.execute(select(
        AllWeightClass.id,
        AllWeightClass.min_weight,
        AllWeightClass.max_weight
    ))
    weight_classes = query.mappings().all()

    query = await db.execute(select(
        AgeCategory.id,
        AgeCategory.min_age,
        AgeCategory.max_age
    ))
    age_classes = query.mappings().all()

    members = []

    for member in participants:

        query = await db.execute(select(TeamMember.member).where(
            TeamMember.id == member))
        athelete_id = query.scalars().one()

        await db.execute(insert(TempDrawParticipants).values(
            athlete_id=athelete_id, member_id=member))
        members.append(athelete_id)

        for member in members:
            query = await db.execute(select(Athlete.weight).where(
                Athlete.id == member))
            weight = float(query.scalars().one())

            for item in weight_classes:
                if float(item.min_weight) <= weight <= float(item.max_weight):
                    await db.execute(update(TempDrawParticipants).where(
                        TempDrawParticipants.athlete_id == member).values(
                            weight_category=int(item.id)))

            query = await db.execute(select(Athlete.user_id).where(
                Athlete.id == member))
            user_id = query.scalars().one()

            query = await db.execute(select(User.birthdate).where(
                User.id == user_id))

            user_year = query.scalars().one()
            user_year = user_year.year
            age_player = datetime.datetime.now().year - user_year

            for item in age_classes:
                if int(item.min_age) <= age_player <= int(item.max_age):
                    await db.execute(update(TempDrawParticipants).where(
                        TempDrawParticipants.athlete_id == member).values(
                            age_category=int(item.id)))

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
                    TempDrawParticipants.member_id).filter_by(
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
                await db.execute(insert(Score).values(
                    event_id=event_id,
                    player_one=pair[0],
                    player_two=pair[1]
                ))
            await db.commit()

    for participant in participants:
        query = await db.execute(select(Match.id).where(
            Match.player_one == participant)
                                 )
        match_id = query.scalars().first()

        await db.execute(update(Score).where(
            Score.player_one == participant).values(match_id=match_id))

        await db.commit()

    return {'Участники': participants, 'Пары для спаринга': combat_pairs}


# Второй тур и последуюющие туры
@router.get("/matchs/draw/{event_id}/{round}")
async def match_round(event_id: int, round: int,
                      db: AsyncSession = Depends(get_db)):

    await db.execute(delete(TempDrawParticipants))
    await db.commit()

    query = await db.execute(select(
        Match.winner_id,
        Match.weight_class_id,
        Match.category_id
    ).where(
        Match.event_id == event_id,
        Match.round == round,
        Match.winner_id.isnot(None)
    ))
    winners = query.mappings().all()

    query = await db.execute(select(
        AgeCategory.id,
        AgeCategory.min_age,
        AgeCategory.max_age
    ))
    age_classes = query.mappings().all()

    athlete_id_list = []

    for winner in winners:
        await db.execute(insert(TempDrawParticipants).values(
            member_id=winner['winner_id'],
            weight_category=winner['weight_class_id'],
            grade_category=winner['category_id']
        ))
        await db.commit()
        query = await db.execute(select(TeamMember.member).where(
            TeamMember.id == winner['winner_id']))
        athlete_id = query.scalars().one()
        athlete_id_list.append(athlete_id)

        await db.execute(update(TempDrawParticipants).where(
            TempDrawParticipants.member_id == winner['winner_id']).values(
                athlete_id=athlete_id)
            )
        await db.commit()

    for athlete_id in athlete_id_list:
        query = await db.execute(select(Athlete.user_id).where(
            Athlete.id == athlete_id))
        user_id = query.scalars().one()

        query = await db.execute(select(User.birthdate).where(
                User.id == user_id))

        user_year = query.scalars().one()
        user_year = user_year.year
        age_player = datetime.datetime.now().year - user_year

        for item in age_classes:
            if int(item.min_age) <= age_player <= int(item.max_age):
                await db.execute(update(TempDrawParticipants).where(
                    TempDrawParticipants.athlete_id == athlete_id).values(
                        age_category=int(item.id)))

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
                    TempDrawParticipants.member_id).filter_by(
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
        print(pairs)
        for pair in pairs:
            print(pair[0], pair[1])
            if pair[1] == '':
                await db.execute(insert(Match).values(
                    event_id=event_id,
                    combat_type_id=1,
                    category_id=1,
                    weight_class_id=1,
                    round=int(round + 1),
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=pair[0],
                    winner_id=pair[0]
                ))
            else:
                await db.execute(insert(Match).values(
                    event_id=event_id,
                    combat_type_id=1,
                    category_id=1,
                    weight_class_id=1,
                    round=int(round + 1),
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=pair[1]
                ))

            await db.commit()

    return {'Участники': winners, 'Пары для спаринга': combat_pairs}


@router.get("/match-score/{event_id}")
async def get_match_score(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    # current_user: UserDB = Depends(current_user)
):
    # query = await db.execute(select(Referee.user_id))
    # all_referee_id = query.scalars().all()
    # print(all_referee_id)
    query = await db.execute(select(Score).where(Score.event_id == event_id))
    matches = query.scalars().all()

    return {'Матчи': matches}


@router.post("/match-score/{match_id}/{referee_id}")
async def update_match_score(
    match_id: int,
    referee_id: int,
    score: MatchScore,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Score).where(Score.match_id == match_id))
    current_match = query.scalars().first()
    query = await db.execute(select(Referee.user_id))
    referees_id = query.scalars().all()
    if current_user.id not in referees_id:
        raise HTTPException(status_code=400, detail="Вы не являетесь судьей")

    query = await db.execute(select(Referee.id).where(
            Referee.user_id == current_user.id))
    referee = query.scalars().first()

    await db.execute(insert(Score).values(
        event_id=current_match.event_id,
        match_id=match_id,
        player_one=current_match.player_one,
        score_player_one=score.score_player_one,
        player_two=current_match.player_two,
        score_player_two=score.score_player_two,
        referee_id=referee,
        ))
    await db.commit()

    return {'Матч': match_id, 'Судья': referee_id}
