from datetime import timedelta
import random
from collections import Counter

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, insert, select, update, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased
from sqlalchemy.sql import func

from auth.models import (AllWeightClass, Athlete, CategoryType, Referee, User,
                         SportType, Country, Region)
from auth.routes import current_user
from auth.schemas import UserDB
from connection import get_db
from event.models import (Event, EventOrganizer, Match, MatchAge,
                          MatchGender, MatchSport, MatchWeights,
                          MatchResult, MatchParticipant, CombatType,
                          MatchCategory, Medal, WinnerTable, Fight, FightCounter,
                          FightReferee, FightWinner)
from match.models import AgeCategory, TempAthlete, TempDrawParticipants
from match.schemas import MatchDB
from match.utils import pairs_generator, split_pairs, round_name
from teams.models import TeamMember, Team
from teams.schemas import Participant

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.post("/add-participant")
async def add_participant(
    participant: Participant,
    db: AsyncSession = Depends(get_db),
):
    new_participant = MatchParticipant(**participant.dict())
    db.add(new_participant)
    await db.commit()
    return {f"Participant ID - {participant.player_id} added"}


@router.post("/draw-participants/{match_id}")
async def draw_participants(
    match_id: int,
    db: AsyncSession = Depends(get_db),
    # current_user: UserDB = Depends(current_user),
):
    # Проверка наличия матча в ивенте
    query = await db.execute(
        select(Match.event_id)
        .where(Match.id == match_id)
    )
    event_id = query.scalars().one_or_none()
    if event_id is None:
        raise HTTPException(status_code=404, detail="Match on Event not found")

    # Проверка организатора мероприятия
    query = await db.execute(
        select(Event.organizer_id)
        .where(Event.id == event_id)
    )
    event_org_id = query.scalars().one_or_none()

    '''query = await db.execute(
        select(EventOrganizer.user_id)
        .where(EventOrganizer.id == event_org_id)
    )
    event_org_user_id = query.scalars().one_or_none()

    if event_org_user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You are not an organizer this Event"
        )'''

    # Проверка существования боев с данным match_id
    query = await db.execute(
        select(Fight.id)
        .where(Fight.match_id == match_id)
    )
    existing_fights = query.scalars().all()
    if existing_fights:
        raise HTTPException(
            status_code=400,
            detail="Fights for this match already exist"
        )

    # Получение id участников, для проверки на дубли
    query = await db.execute(
        select(MatchParticipant.player_id)
        .where(MatchParticipant.match_id == match_id)
    )
    players_ids = query.scalars().all()

    # Проверка на дублирующиеся идентификаторы участников
    players_counter = Counter(players_ids)
    duplicate_ids = [
        pid for pid, count in players_counter.items() if count > 1
    ]
    if duplicate_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Duplicate players IDs found: {duplicate_ids}"
        )

    # Получение участников
    query = await db.execute(
        select(MatchParticipant.id)
        .where(MatchParticipant.match_id == match_id)
    )
    participants = query.scalars().all()

    ''' Дописать выбор спортивной сетки в зависимости,
    что стоит в match.combat_type_id'''

    query = await db.execute(select(Match.mat_vol).where(Match.id == match_id))
    mat_vol = query.scalars().first()

    mat_counter = 0
    pairs = split_pairs(participants)

    for pair in pairs:
        query = await db.execute(
            select(Match).where(Match.id == match_id)
            .where(MatchParticipant.id == pair[0])
        )
        match = query.scalars().first()
        new_fight = Fight(
            match_id=match_id,
            start_datetime=match.start_datetime,
            end_datetime=(
                match.start_datetime+timedelta(seconds=match.nominal_time)
            ),
            player_one=pair[0],
            player_two=pair[1],
            mat=(mat_counter % mat_vol) + 1,
            round=1,
        )
        # Увеличиваем счетчик мата
        mat_counter += 1

        db.add(new_fight)
        await db.commit()

    return {"ok"}


@router.post("/random-fights-1-round/{match_id}")
async def random_fights(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(
        select(Fight.id)
        .where(Fight.match_id == match_id)
    )
    all_fights = query.scalars().all()

    if not all_fights:
        raise HTTPException(
            status_code=404, detail="No fights found for this match"
        )

    for fight_id in all_fights:
        query = await db.execute(
            select(Fight.player_one, Fight.player_two)
            .where(Fight.id == fight_id)
         )
        pair = query.mappings().first()

        if pair is None:
            raise HTTPException(
                status_code=404, detail=f"Fight with id {fight_id} not found"
            )

        fight_pair = {k: v for k, v in pair.items()}

        if fight_pair['player_two'] == 0:
            counter = FightCounter(
                fight_id=fight_id,
                player=fight_pair['player_one'],
                player_score='5',
                set_datetime=func.now(),
            )
            db.add(counter)
            await db.commit()
            winner = FightWinner(
                fight_id=fight_id,
                winner_id=fight_pair['player_one'],
                winner_score=5,
                loser_score=0
            )
            db.add(winner)
            await db.commit()
        else:
            random_winner = random.choice(list(fight_pair.values()))
            second_value = next(
                value for value in fight_pair.values()
                if value != random_winner
            )
            counter = FightCounter(
                fight_id=fight_id,
                player=random_winner,
                player_score='5',
                set_datetime=func.now(),
            )
            db.add(counter)
            await db.commit()
            counter = FightCounter(
                fight_id=fight_id,
                player=second_value,
                player_score='0',
                set_datetime=func.now(),
            )
            db.add(counter)
            await db.commit()
            winner = FightWinner(
                fight_id=fight_id,
                winner_id=random_winner,
                winner_score=5,
                loser_score=0
            )
            db.add(winner)
            await db.commit()

    return {"ok"}


@router.post("/all-next-round/{match_id}")
async def create_next_round(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    while True:

        # Получаем текущий раунд
        query = await db.execute(
            select(func.max(Fight.round))
            .where(Fight.match_id == match_id)
        )
        current_round = query.scalars().first()

        if current_round is None:
            raise HTTPException(
                status_code=404, detail="No fights found for this match"
            )

        next_round = current_round + 1

        # Получаем победителей текущего раунда
        winner_alias = aliased(FightWinner)
        query = await db.execute(
            select(winner_alias.winner_id)
            .join(Fight, Fight.id == winner_alias.fight_id)
            .where(Fight.match_id == match_id)
            .where(Fight.round == current_round)
        )
        winners = query.scalars().all()

        if len(winners) == 1:
            # Если остался только один победитель, завершаем турнир
            final_winner = winners[0]
            return {"winner": final_winner}
        if len(winners) < 2:
            raise HTTPException(
                status_code=400, detail="Not enough players for the next round"
            )

        # Получаем количество матов
        query = await db.execute(
            select(Match.mat_vol)
            .where(Match.id == match_id)
        )
        mat_vol = query.scalars().first()

        if mat_vol is None:
            raise HTTPException(status_code=404, detail="Match not found")

        mat_counter = 0
        pairs = [
            (winners[i], winners[i + 1]) for i in range(0, len(winners), 2)
        ]

        for pair in pairs:
            random_winner = random.choice(pair)
            random_loser = pair[0] if random_winner == pair[1] else pair[1]

            fight = Fight(
                match_id=match_id,
                player_one=pair[0],
                player_two=pair[1],
                start_datetime=func.now(),
                end_datetime=func.now() + timedelta(minutes=5),
                mat=(mat_counter % mat_vol) + 1,
                round=next_round,
            )
            mat_counter += 1
            db.add(fight)
            await db.commit()

            # Создаем записи о результатах боя
            winner_counter = FightCounter(
                fight_id=fight.id,
                player=random_winner,
                player_score='5',
                set_datetime=func.now(),
            )
            loser_counter = FightCounter(
                fight_id=fight.id,
                player=random_loser,
                player_score='0',
                set_datetime=func.now(),
            )
            db.add(winner_counter)
            db.add(loser_counter)

            winner = FightWinner(
                fight_id=fight.id,
                winner_id=random_winner,
                winner_score=5,
                loser_score=0
            )
            db.add(winner)

        await db.commit()


@router.get("/tournament-grid/{match_id}")
async def get_grid(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = {}
    query = await db.execute(
        select(
            Match.id.label("match_id"),
            Match.name.label("match_name"),
            Match.start_datetime.label("match_start_time"),
            Match.end_datetime.label("match_end_time"),
            CombatType.name.label("method"),
            MatchAge.age_from,
            MatchAge.age_till,
            SportType.name.label("sport_name"),
            AllWeightClass.name.label("weight_category"),
            MatchGender.gender.label("gender"),
        )
        .join(CombatType, CombatType.id == Match.combat_type_id)
        .join(MatchAge, MatchAge.match_id == Match.id)
        .join(MatchSport, MatchSport.match_id == Match.id)
        .join(SportType, SportType.id == MatchSport.sport_id)
        .join(MatchWeights, MatchWeights.match_id == Match.id)
        .join(AllWeightClass, AllWeightClass.id == MatchWeights.weight_id)
        .join(MatchGender, MatchGender.match_id == Match.id)
        .where(Match.id == match_id)
    )
    grid_info = query.mappings().first()
    result["grid_info"] = {
        "match_id": grid_info["match_id"],
        "match_name": grid_info["match_name"],
        "start_time": grid_info["match_start_time"],
        "end_time": grid_info["match_end_time"],
        "method": grid_info["method"],
        "age_from": grid_info["age_from"],
        "age_till": grid_info["age_till"],
        "sport_name": grid_info["sport_name"],
        "weight_category": grid_info["weight_category"],
        "gender": grid_info["gender"]
    }

    # Получаем информацию обо всех раундах и боях
    rounds = []
    current_round = 1
    while True:
        round_info = await get_round_info(db, match_id, current_round)
        if not round_info["fights"]:
            break
        rounds.append(round_info)
        current_round += 1

    result["rounds"] = rounds

    return result


async def get_round_info(db, match_id, round_number):
    query = await db.execute(
        select(
            Fight.id,
            Fight.mat.label("mat_number"),
            Fight.start_datetime.label("start_time"),
            Fight.player_one,
            Fight.player_two
        )
        .where(Fight.match_id == match_id)
        .where(Fight.round == round_number)
    )
    fights = query.mappings().all()

    if not fights:
        return {"name": round_name(0), "fights": []}

    fight_infos = []

    for fight in fights:
        player_1 = await get_player_info(db, fight.player_one)
        player_1_score = await get_player_score(db, fight.player_one)
        player_2 = await get_player_info(db, fight.player_two)
        player_2_score = await get_player_score(db, fight.player_two)

        fight_info = {
            "fight_info": {
                "fight_id": fight.id,
                "mat_number": fight.mat_number,
                "start_time": fight.start_time,
            },
            "player_1": {
                "player_id": player_1["player_id"],
                "first_name": player_1["first_name"],
                "last_name": player_1["last_name"],
                "birthdate": player_1["birthdate"],
                "team_name": player_1["team_name"],
                "team_id": player_1["team_id"],
                "points": player_1_score,
            },
            "player_2": {
                "player_id": player_2["player_id"],
                "first_name": player_2["first_name"],
                "last_name": player_2["last_name"],
                "birthdate": player_2["birthdate"],
                "team_name": player_2["team_name"],
                "team_id": player_2["team_id"],
                "points": player_2_score,
            },
        }
        fight_infos.append(fight_info)

    players_count = len(fight_infos) * 2
    return {"name": round_name(players_count), "fights": fight_infos}


async def get_player_info(db, player_id):
    query = await db.execute(
        select(
            MatchParticipant.id.label("player_id"),
            User.name.label("first_name"),
            User.sirname.label("last_name"),
            User.birthdate,
            Athlete.image_field,
            Team.name.label("team_name"),
            Team.id.label("team_id")
        )
        .join(Athlete, Athlete.id == MatchParticipant.player_id)
        .join(User, User.id == Athlete.user_id)
        .join(Team, Team.id == MatchParticipant.team_id)
        .where(MatchParticipant.id == player_id)
    )
    return query.mappings().first()


async def get_player_score(db, player_id):
    query = await db.execute(
        select(FightCounter.player_score)
        .where(FightCounter.player == player_id)
    )
    player_scores = query.scalars().all()
    total_score = sum(int(score) for score in player_scores)
    return total_score

    '''# Получаем информацию о раундах и поединках
    query = await db.execute(
        select(
            Fight.id,
            Fight.mat.label("mat_number"),
            Fight.start_datetime.label("start_time"),
            Fight.player_one,
            Fight.player_two
        ).where(Fight.match_id == match_id)
    )
    fights = query.mappings().all()

    for fight in fights:
        # Получаем информацию об игроке 1
        query = await db.execute(
            select(
                MatchParticipant.id.label("player_id"),
                User.name.label("first_name"),
                User.sirname.label("last_name"),
                User.birthdate,
                Athlete.image_field,
                Team.name.label("team_name"),
                Team.id.label("team_id"),
            )
            .select_from(Fight)
            .join(MatchParticipant, MatchParticipant.id == fight.player_one)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .join(Team, Team.id == MatchParticipant.team_id)
            .where(Fight.id == fight.id)
        )
        player_1 = query.mappings().first()
        query = await db.execute(
            select(
                FightCounter.player_score
            )
            .where(FightCounter.player == player_1["player_id"])
        )
        player_1_score = query.scalars().all()
        points_player_1 = 0
        for score in player_1_score:
            points_player_1 = points_player_1 + int(score)

        # Получаем информацию об игроке 2
        query = await db.execute(
            select(
                MatchParticipant.id.label("player_id"),
                User.name.label("first_name"),
                User.sirname.label("last_name"),
                User.birthdate,
                Athlete.image_field,
                Team.name.label("team_name"),
                Team.id.label("team_id"),
            )
            .select_from(Fight)
            .join(MatchParticipant, MatchParticipant.id == fight.player_two)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .join(Team, Team.id == MatchParticipant.team_id)
            .where(Fight.id == fight.id)
        )
        player_2 = query.mappings().first()
        query = await db.execute(
            select(
                FightCounter.player_score
            )
            .where(FightCounter.player == player_2["player_id"])
        )
        player_2_score = query.scalars().all()
        points_player_2 = 0
        for score in player_2_score:
            points_player_2 = points_player_2 + int(score)

        fight_info = {
            "fight_info": {
                "fight_id": fight.id,
                "mat_number": fight.mat_number,
                "start_time": fight.start_time,
            },
            "player_1": {
                "player_id": player_1["player_id"],
                "first_name": player_1["first_name"],
                "last_name": player_1["last_name"],
                "birthdate": player_1["birthdate"],
                "team_name": player_1["team_name"],
                "team_id": player_1["team_id"],
                "points": points_player_1,
            },
            "player_2": {
                "player_id": player_2["player_id"],
                "first_name": player_2["first_name"],
                "last_name": player_2["last_name"],
                "birthdate": player_2["birthdate"],
                "team_name": player_2["team_name"],
                "team_id": player_2["team_id"],
                "points": points_player_2,
            },
        }
        # print(player_1)
        # print(points_player_1)
        # print(player_2)
        # print(points_player_2)

        rounds["fights"].append(fight_info)

    result["rounds"] = [rounds]

    return result'''


@router.get("/{event_id}/all-participants")
async def get_all_participants(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = []
    unique_users = set()

    query = await db.execute(
        select(Match.id)
        .where(Match.event_id == event_id)
    )
    matches = query.scalars().all()
    if matches is None:
        raise HTTPException(status_code=404, detail="Match not found")

    for match in matches:

        query = await db.execute(
            select(MatchParticipant.player_id)
            .where(MatchParticipant.match_id == match)
        )
        participants = query.scalars().all()

        for athelete_id in participants:
            query = await db.execute(
                select(Athlete.user_id).where(Athlete.id == athelete_id)
            )
            user_id = query.scalars().first()

            if user_id not in unique_users:
                query = await db.execute(
                    select(
                        User.id.label("user_id"),
                        User.name,
                        User.sirname,
                        User.fathername,
                        Athlete.country.label("country"),
                        Athlete.region.label("region"),
                        Athlete.city.label("city"),
                        Team.name.label("team"),
                        User.birthdate,
                        Athlete.weight.label("weight"),
                        CategoryType.name.label("grade"),
                        User.gender.label("gender"),
                        Athlete.image_field,
                    )
                    .join(Athlete, Athlete.user_id == User.id)
                    .join(MatchParticipant)
                    .join(Team, Team.id == MatchParticipant.team_id)
                    .join(MatchCategory, MatchCategory.match_id == match)
                    .join(
                        CategoryType,
                        CategoryType.id == MatchCategory.category_id
                    )
                    .where(User.id == user_id)
                )
                users_info = query.mappings().all()

                result.append(users_info[0])
                unique_users.add(user_id)

    return result


'''@router.get("/matches")
async def get_matches(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match))
    return query.scalars().all()


@router.get("/matches/{id}")
async def get_match(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match).where(Match.id == id))
    return query.scalars().one_or_none()


# Организатор может поменять участников например
@router.post("/matches/update/{match_id}")
async def update_match(
    match_id: int,
    match_data: MatchDB,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user),
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    match.combat_type_id = match_data.combat_type_id,
    match.category_id = match_data.category_id,
    match.sport_id = match_data.sport_id,
    match.weight_class_id = match_data.weight_class_id,
    match.round = match_data.round,
    match.start_datetime = match_data.start_datetime,
    match.end_datetime = match_data.end_datetime,
    match.player_one = match_data.player_one,
    match.player_two = match_data.player_two
    await db.commit()
    return {f"Match ID - {match_id} updated"}


@router.delete("/matchs/delete/{match_id}")
async def delete_match(
    match_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    await db.delete(match)
    await db.commit()

    return {f"Match ID - {match_id} deleted"}


@router.get("/matchs/draw/{event_id}/{round}")
async def temp_participants(
    event_id: int, round: int,
    db: AsyncSession = Depends(get_db)
):

    # Очищаем данные из таблицы
    await db.execute(delete(TempDrawParticipants))
    await db.commit()

    # добавить сортировки и вставки в таблицы по раундам
    if round == 1:
        query = await db.execute(select(Participant.player_id).where(
            Participant.event_id == event_id))
        participants = query.scalars().all()
    else:
        query = await db.execute(select(MatchResult.winner_id))
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

    members = []  # сохраням все id атлетов

    for participant in participants:

        query = await db.execute(select(TeamMember.member).where(
            TeamMember.id == participant))
        athelete_id = query.scalars().one()

        await db.execute(insert(TempDrawParticipants).values(
            athlete_id=athelete_id, member_id=participant))

        members.append(athelete_id)

        for member in members:
            query = await db.execute(select(Athlete.weight).where(
                Athlete.id == member))
            weight = query.scalars().one()
            # записываем весовую категорию
            for item in weight_classes:
                if float(item.min_weight) <= weight <= float(item.max_weight):
                    await db.execute(update(TempDrawParticipants).where(
                        TempDrawParticipants.athlete_id == member).values(
                            weight_category=int(item.id)))
            # узнаем возраст атлета
            query = await db.execute(select(Athlete.user_id).where(
                Athlete.id == member))
            user_id = query.scalars().one()

            query = await db.execute(select(User.birthdate).where(
                User.id == user_id))
            user_year = query.scalars().one()

            user_year = user_year.year
            age_player = datetime.datetime.now().year - user_year
            # записываем возрастную категорию
            for item in age_classes:
                if int(item.min_age) <= age_player <= int(item.max_age):
                    await db.execute(update(TempDrawParticipants).where(
                        TempDrawParticipants.athlete_id == member).values(
                            age_category=int(item.id)))
            # пол атлета
            query = await db.execute(select(User.gender).where(
                User.id == user_id))
            user_gender = query.scalars().one()
            await db.execute(update(TempDrawParticipants).where(
                TempDrawParticipants.athlete_id == member).values(
                    gender=user_gender))

    await db.commit()

    # пареаметры для сортировки
    query = await db.execute(select(AgeCategory))
    age = query.scalars().all()
    ages = len(age)
    query = await db.execute(select(AllWeightClass))
    weight = query.scalars().all()
    weights = len(weight)
    query = await db.execute(select(TempDrawParticipants.gender).distinct())
    gender = query.scalars().all()
    genders = len(gender)

    all_pairs = {}
    # сохраняем в словарь все совпадения по параметрам сортировки
    for gender in range(genders):
        for weight in range(1, weights + 1):
            for age in range(1, ages + 1):

                query = await db.execute(select(
                    TempDrawParticipants.member_id).filter_by(
                        weight_category=weight,
                        age_category=age,
                        gender=bool(gender)
                        ))
                athletes = query.scalars().all()

                if len(athletes) == 0:
                    continue
                all_pairs.update({(weight, age, gender): athletes})

    combat_pairs = []
    pairs = list([*all_pairs.values()])

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
                    round=round,
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=999
                ))
            else:
                await db.execute(insert(Match).values(
                    event_id=event_id,
                    combat_type_id=1,
                    category_id=1,
                    weight_class_id=1,
                    round=round,
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=pair[1]
                ))
            await db.commit()

    query = await db.execute(select(
        Match.id,
        Match.player_one,
        Match.player_two,
        Match.start_datetime).where(Match.round == round))
    matches = query.mappings().all()
    for match in matches:
        if match.player_two == 999:  # зарезервировать определенный ID атлета для определения победителя
            await db.execute(insert(MatchResult).values(
                match_id=match.id,
                winner_id=match.player_one,
                winner_score=str(0),
                loser_score=str(0)
            ))
            await db.commit()
        else:
            await db.execute(insert(MatchCounter).values(
                match_id=match.id,
                player_one=match.player_one,
                player1_score=str(0),
                player_two=match.player_two,
                player2_score=str(0),
                set_datetime=match.start_datetime,
            ))

    return {"ok": True}


# Назначаем судей на матч
# Пришлашаем бойцов на ковер
# Надо узнать как происходит на мероприятии
@router.post("/matchs/{match_id}/start")
async def start_match(
    match_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(MatchCounter).where(match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    query = await db.execute(select(Referee.user_id).where(
        Referee.user_id == current_user.id
    ))
    referee = query.scalars().one_or_none()
    if referee is None:
        raise HTTPException(status_code=400, detail="You are not a referee")

    # Подумать как записать в таблицу несколько судей
    await db.execute(insert(MatchReferee).values(
        match_id=match_id,
        referee_id=current_user.id,
        chief=True
    ))
    await db.commit()
    query = await db.execute(select(
        MatchCounter.player_one,
        MatchCounter.player_two).where(match_id == match_id))
    players = query.mappings().all()
    player_1 = players[0]['player_one']
    player_2 = players[0]['player_two']

    #Возможно здесь правитьльно вытащить Фамилию Имя Отчество из таблицы
        #Users И вывести его вместо ID на фронт.
        #С Фамилией Именем Отчеством судьи аналогичная ситуация

    return {"Участник 1": player_1, "Участник 2": player_2, "Судья": referee}


@router.post("/matchs/{match_id}/counter")
async def counter_match(
    match_id: int,
    player1_score: int,
    player2_score: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user),
):
    query = await db.execute(select(MatchCounter).where(match_id == match_id))
    match = query.scalars().first()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    await db.execute(insert(MatchCounter).values(
        match_id=match_id,
        player_one=match.player_one,
        player1_score=str(player1_score),
        player_two=match.player_two,
        player2_score=str(player2_score),
        set_datetime=datetime.datetime.utcnow(),
        referee_id=current_user.id
    ))
    await db.commit()

    return {"ok": True}


@router.post("/matchs/{match_id}/result")
async def result_match(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        MatchCounter.match_id).where(match_id == match_id))
    match = query.scalars().all()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    query = await db.execute(select(
        MatchCounter.referee_id).where(match_id == match_id))
    referee = query.scalars().first()

    query = await db.execute(select(
        MatchCounter.player_one,
        MatchCounter.player1_score,
        MatchCounter.player_two,
        MatchCounter.player2_score).where(MatchCounter.match_id == match_id))
    match_all = query.mappings().all()

    player1_score = 0
    player2_score = 0
    for match in match_all:
        player1_score += int(match.player1_score)
        player2_score += int(match.player2_score)

    if player1_score > player2_score:
        await db.execute(insert(MatchResult).values(
            match_id=match_id,
            winner_id=match_all[0]['player_one'],
            winner_score=str(player1_score),
            loser_score=str(player2_score),
            referee_id=referee
        ))
        await db.commit()
    else:
        await db.execute(insert(MatchResult).values(
            match_id=match_id,
            winner_id=match_all[0]['player_two'],
            winner_score=str(player2_score),
            loser_score=str(player1_score),
            referee_id=referee
        ))
        await db.commit()

    return {"Результаты записаны": match_id}'''


@router.get("/matches-results/{event_id}")
async def get_matches_results(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = []
    query = await db.execute(
        select(Match.id).where(Match.event_id == event_id)
    )
    matches = query.scalars().all()

    if matches is None:
        raise HTTPException(status_code=404, detail="Match not found")

    for match_id in matches:

        query = await db.execute(
            select(
                Match.id.label('match_id'),
                Match.name,
                CombatType.name.label('combat_type'),
                Match.start_datetime,
                Match.end_datetime,
                MatchAge.age_from.label('age_min'),
                MatchAge.age_till.label('age_max'),
                AllWeightClass.min_weight.label('min_weight'),
                AllWeightClass.max_weight.label('max_weight'),
                SportType.name.label('sport_name'),
                MatchGender.gender.label('gender'),
            ).select_from(Match)
            .join(CombatType, CombatType.id == Match.combat_type_id)
            .join(MatchAge, MatchAge.match_id == Match.id)
            .join(MatchWeights, MatchWeights.match_id == Match.id)
            .join(AllWeightClass, AllWeightClass.id == MatchWeights.weight_id)
            .join(MatchSport, MatchSport.match_id == Match.id)
            .join(SportType, SportType.id == MatchSport.sport_id)
            .join(MatchGender, MatchGender.match_id == Match.id)
            .where(Match.id == match_id)
        )
        match_data = query.mappings().all()

        query = await db.execute(
            select(
                MatchResult.p1_id.label('1 - место'),
                MatchResult.p1_score.label('очки'),
                User.id,
                User.name,
                User.sirname,
                User.fathername,
                Athlete.country
            ).select_from(MatchResult)
            .join(MatchParticipant, MatchParticipant.id == MatchResult.p1_id)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .where(MatchResult.match_id == match_id))
        match_result_part_id_1 = query.mappings().first()

        match_data.append(match_result_part_id_1)

        query = await db.execute(
            select(
                MatchResult.p2_id.label('2 - место'),
                MatchResult.p2_score.label('очки'),
                User.id,
                User.name,
                User.sirname,
                User.fathername,
            ).select_from(MatchResult)
            .join(MatchParticipant, MatchParticipant.id == MatchResult.p2_id)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .where(MatchResult.match_id == match_id))
        match_result_part_id_2 = query.mappings().first()

        match_data.append(match_result_part_id_2)

        query = await db.execute(
            select(
                MatchResult.p3_id.label('3 - место'),
                MatchResult.p3_score.label('очки'),
                User.id,
                User.name,
                User.sirname,
                User.fathername,
            ).select_from(MatchResult)
            .join(MatchParticipant, MatchParticipant.id == MatchResult.p3_id)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .where(MatchResult.match_id == match_id))
        match_result_part_id_3 = query.mappings().first()

        match_data.append(match_result_part_id_3)

        result.append(match_data)

    return result


'''@router.post("/matchs-results/{match_id}")
async def post_matchs_results(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(
        select(
            MatchParticipant.id
        ).where(MatchParticipant.match_id == match_id))
    players = query.scalars().all()

    new_result = MatchResult(
        match_id=match_id,
        p1_id=players[0],
        p2_id=players[1],
        p3_id=players[2],
        p1_score='300',
        p2_score='200',
        p3_score='100'
    )
    db.add(new_result)
    await db.commit()
    return {"ok"}'''


'''@router.post("/matchs-results/{match_id}/random")
async def post_matchs_results_medal(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(
        select(
            MatchParticipant.id
        )
        .where(MatchParticipant.match_id == match_id)
    )
    match_participant_id = query.scalars().all()
    randoms_id = random.sample(match_participant_id, len(match_participant_id))
    query = await db.execute(select(Medal.id))
    medal_id = query.scalars().all()
    i = 0
    for id in randoms_id:
        new_winer = WinnerTable(
            match_id=match_id,
            winner_id=id,
            winner_score='100'+str(i),
            medal=medal_id[i]
        )
        i += 1
        db.add(new_winer)
        await db.commit()

    return {"ok"}'''
