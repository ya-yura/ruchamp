import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert, delete

from connection import get_db
from event.models import (Event, Match, EventOrganizer, Participant,
                          MatchPeriod, MatchCounter, MatchResult, MatchWinner)
from auth.models import User, Athlete, AllWeightClass, CategoryType
from match.schemas import MatchDB
from match.models import TempAthlete, TempDrawParticipants, AgeCategory
from auth.schemas import UserDB
from auth.routes import current_user
from teams.models import TeamMember
from match.utils import split_pairs, pairs_generator
from re import match


router = APIRouter(prefix="/api", tags=["Matchs"])


@router.get("/matchs")
async def get_matchs(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match))
    return query.scalars().all()


@router.get("/matchs/{id}")
async def get_match(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Match).where(Match.id == id))
    return query.scalars().one_or_none()


# Организатор может поменять участников например
@router.post("/matchs/update/{match_id}")
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
    match.combat_type_id=match_data.combat_type_id,
    match.category_id=match_data.category_id,
    match.sport_id=match_data.sport_id,
    match.weight_class_id=match_data.weight_class_id,
    match.round=match_data.round,
    match.start_datetime=match_data.start_datetime,
    match.end_datetime=match_data.end_datetime,
    match.player_one=match_data.player_one,
    match.player_two=match_data.player_two
    await db.commit()
    return {f"Match ID - {match_id} updated"}


@router.delete("/matchs/delete/{match_id}")
async def delete_match(
    match_id:int,
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

            query = await db.execute(select(User.gender).where(
                User.id == user_id))
            user_gender = query.scalars().one()
            await db.execute(update(TempDrawParticipants).where(
                TempDrawParticipants.athlete_id == member).values(
                    gender=user_gender))
                

    await db.commit()

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
                    round=1,
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
                    round=1,
                    start_datetime=datetime.datetime.utcnow(),
                    end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    player_one=pair[0],
                    player_two=pair[1]
                ))
            await db.commit()

    query = await db.execute(select(Match.id, Match.start_datetime, Match.end_datetime))
    matches = query.mappings().all()
    print(matches)
    for match in matches:
        await db.execute(insert(MatchPeriod).values(
            match_id=match.id,
            start_datetime=match.start_datetime,
            end_datetime=match.end_datetime,
            winner_score = str(0),
            loser_score = str(0)
        ))
        await db.commit()
    
    return {"ok": True}


@router.post("/matchs/{match_id}/result")
async def result_match(
    match_id: int,
    player1_score: int,
    player2_score: int,
    db: AsyncSession = Depends(get_db)
):
    await db.execute(delete(MatchCounter))
    await db.commit()
    
    await db.execute(insert(MatchCounter).values(
        match_id=match_id,
        player1_score=str(player1_score),
        player2_score=str(player2_score),
        set_datetime=datetime.datetime.utcnow(),
        referee_id=1
    ))
    await db.commit()
    query = await db.execute(select(
        MatchCounter.match_id,
        MatchCounter.player1_score,
        MatchCounter.player2_score,
        MatchCounter.referee_id).where(match_id == match_id))
    match = query.mappings().all()
    
    if int(match[0].player1_score) > int(match[0].player2_score):
        await db.execute(update(MatchPeriod).where(MatchPeriod.match_id == match_id).values(
            match_id=match[0].match_id,
            winner_score=match[0].player1_score,
            loser_score=match[0].player2_score))
        await db.execute(insert(MatchResult).values(
            match_id=match[0].match_id,
            winner_score=match[0].player1_score,
            loser_score=match[0].player2_score,
            referee_id=match[0].referee_id
        ))
        # нет связи с id атлета
        '''await db.execute(insert(MatchWinner).values(
            match_id=match[0].match_id,
            winner=match[0].player1_score,
        ))'''
        await db.commit()
    else:
        await db.execute(update(MatchPeriod).where(MatchPeriod.match_id == match_id).values(
            match_id=match[0].match_id,
            winner_score=match[0].player2_score,
            loser_score=match[0].player1_score))
        await db.execute(insert(MatchResult).values(
            match_id=match[0].match_id,
            winner_score=match[0].player2_score,
            loser_score=match[0].player1_score,
            referee_id=match[0].referee_id
        ))
        # нет связи с id атлета
        '''await db.execute(insert(MatchWinner).values(
            match_id=match[0].match_id,
            winner=match[0].player2_score,
        ))'''
        await db.commit()
    return {"Результаты записаны": match_id}



'''@router.get("/matchs/result/{event_id}/{round}")
async def result_match(
    event_id: int,
    round: int,
    db: AsyncSession = Depends(get_db)
):
    
    query = await db.execute(select(Match.id, Match.player_one, Match.player_two).where(
        Match.event_id == event_id,
        Match.round == round))
    matches = query.mappings().all()
    query = await db.execute(select(MatchPeriod).where(
        MatchPeriod.match_id == matches[0].id
    ))
    match_period = query.mappings().all()
    


# Второй и последующие раунды
@router.get("/matchs/draw/{event_id}/{round}")
async def next_round(
    event_id: int,
    round: int,
    db: AsyncSession = Depends(get_db)
):
    
    query = await db.execute(select(Match.id, Match.player_one, Match.player_two).where(
        Match.event_id == event_id,
        Match.round == round
    ))
    matches = query.mappings().all()

    for match in matches:
        await db.execute(update(Match).where(
            Match.id == match.id
        ).values(
            round=round + 1,
            start_datetime=datetime.datetime.utcnow(),
            end_datetime=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            player_one=999,
            player_two=999
        ))
        await db.commit()

    return {"ok": True}'''