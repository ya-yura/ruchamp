import os
import uuid
import re
from datetime import timedelta

from aiofiles import open as async_open
from fastapi import (APIRouter, Depends, File, HTTPException,
                     UploadFile)
from fastapi.templating import Jinja2Templates
from sqlalchemy import select, update, and_
from sqlalchemy.ext.asyncio import AsyncSession

# from auth.models import SystemAdministrator
from auth.routes import current_user
from auth.schemas import UserDB
from auth.models import (SportType, Athlete)
# from auth.models import User, athlete_sport_type_association
from connection import get_db
from event.models import (Event, EventOrganizer, Match, CombatType,
                          CategoryType, AllWeightClass, TournamentApplication,
                          ApplicationStatusHistory, MatchAge, MatchSport,
                          MatchGender, MatchCategory, AthleteApplication,
                          MatchWeights)  # MatchParticipant
from event.shemas import (EventCreate, EventUpdate, MatchCreate,
                          MatchRead, CreateTournamentApplicationTeam,
                          CreateTournamentApplicationAthlete,
                          UpdateTournamentApplication)
from teams.models import Team
from shop.models import Ticket, Engagement
from geo.geo import get_geo

router = APIRouter(prefix="/event", tags=["Events"])
templates = Jinja2Templates(directory='templates')


@router.get("/events")
async def get_events(
    db: AsyncSession = Depends(get_db)
):
    sports_in_matches_info = []
    query = await db.execute(select(Event.id))
    events_id = query.scalars().all()
    result = []
    for event_id in events_id:
        query = await db.execute(
            select(
                Event.id,
                Event.name,
                Event.start_request_datetime,
                Event.end_request_datetime,
                Event.start_datetime,
                Event.end_datetime,
                EventOrganizer.organization_name.label("organizer_name"),
                Event.location,
                Event.event_system,
                Event.event_order,
                Event.image_field,
                Event.description,
                Event.geo
            ).join(
                EventOrganizer, EventOrganizer.id == Event.organizer_id
            ).where(Event.id == event_id)
        )
        event_info = query.mappings().all()
        event = event_info[0]
        query = await db.execute(
            select(Match.id)
            .where(Match.event_id == event_id)
        )
        matches_id = query.scalars().all()
        sports_in_matches_info = []
        for match_id in matches_id:
            query = await db.execute(
                select(Match.sport_id).where(Match.id == match_id))
            match_sport_id = query.scalars().all()

            for sport_id in match_sport_id:
                query = await db.execute(
                    select(SportType.name)
                    .where(SportType.id == sport_id)
                )
                sport_name = query.scalars().first()
                sports_in_matches_info.append(sport_name)

        event_result = {k: v for k, v in event.items()}

        event_result["sports_in_matches"] = sports_in_matches_info
        result.append(event_result)

    return result


@router.get("/events/me")
async def get_events_me(
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(
        select(EventOrganizer.id)
        .where(EventOrganizer.user_id == current_user.id)
    )
    event_org_id = query.scalars().first()

    query = await db.execute(
        select(Event).where(Event.organizer_id == event_org_id)
    )
    event = query.mappings().all()

    return event


@router.get("/{event_id}")
async def get_events_id(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = []
    query = await db.execute(select(
        Event.id,
        Event.name,
        EventOrganizer.organization_name.label("organizer_name"),
        Event.description,
        Event.location,
        Event.start_request_datetime,
        Event.end_request_datetime,
        Event.start_datetime,
        Event.end_datetime,
        Event.event_order,
        Event.event_system,
        Event.image_field,
        Event.geo,
    ).join(
        EventOrganizer, EventOrganizer.id == Event.organizer_id
    ).where(Event.id == event_id))
    event_info = query.mappings().all()
    if event_info == []:
        raise HTTPException(status_code=404, detail="Event not found")
    event = event_info[0]
    query = await db.execute(
        select(Match.id).where(Match.event_id == event_id)
    )
    matches_id = query.scalars().all()
    sports_in_matches_info = []
    for match_id in matches_id:
        query = await db.execute(
            select(Match.sport_id).where(Match.id == match_id)
        )
        match_sport_id = query.scalars().all()
        for sport_id in match_sport_id:
            query = await db.execute(
                select(SportType.name).where(SportType.id == sport_id)
            )
            sport_name = query.scalars().first()
            sports_in_matches_info.append(sport_name)

    event_result = {k: v for k, v in event.items()}
    event_result["sports_in_matches"] = sports_in_matches_info
    result.append(event_result)

    return result


@router.post("/create")
async def create_event(
    event_data: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query.scalars().all()

    # Подумать: почему админ не добавляется в организаторы
    # query_admin = await db.execute(select(SystemAdministrator.user_id))
    # all_admin_id = query_admin.scalars().all()
    # all_organizer_id.extend(all_admin_id)

    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")
    new_event = Event(**event_data.dict())
    db.add(new_event)
    await db.commit()

    return {f"Event {new_event.name} - created"}


@router.post("/update-image/{event_id}")
async def update_image_in_event(
    event_id: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Event).where(
        Event.id == event_id))

    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # Validate the file type
    if image.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=406,
                            detail="Only .jpeg or .png files allowed"
                            )

    image_name = f"{uuid.uuid4().hex}.{image.filename.split('.')[-1]}"
    image_path = os.path.join("static/event/", image_name)

    async with async_open(image_path, 'wb') as f:
        await f.write(await image.read())

    event.image_field = f"/static/event/{image_name}"
    await db.commit()
    return {f"Event {event_id} updated"}


@router.post("/update-geo/{event_id}")
async def update_geo_in_event(event_id: int,
                              db: AsyncSession = Depends(get_db)):

    query = await db.execute(select(Event.location).where(
        Event.id == event_id))

    location = query.scalars().one_or_none()
    geo = str(get_geo(location))

    await db.execute(update(Event).where(
        Event.id == event_id).values(geo=geo))

    await db.commit()
    return {f"Events {event_id} updated"}


@router.put("/update/{event_id}")
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Event).where(Event.id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    event.name = event_data.name
    event.start_datetime = event_data.start_datetime
    event.end_datetime = event_data.end_datetime
    event.start_request_datetime = event_data.start_request_datetime
    event.end_request_datetime = event_data.end_request_datetime
    event.location = event_data.location
    event.description = event_data.description
    await db.commit()
    return {f"Event ID - {event_id} updated"}


@router.post("/delete/{event_id}")
async def delete_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Event).where(Event.id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return {f"Event ID - {event_id} deleted"}


@router.get("/{event_id}/matches")
async def get_participants(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(
        select(Match.id)
        .where(Match.event_id == event_id)
    )
    all_matches_id = query.scalars().all()
    if all_matches_id == []:
        raise HTTPException(status_code=404, detail="No matches found")

    matches = []
    for match_id in all_matches_id:
        query = await db.execute(
            select(
                SportType.name.label("sport_name"),
                CombatType.name.label("combat_type"),
                CategoryType.name.label("category_type"),
                Match.age,
                AllWeightClass.name.label("weigth_category"),
                Match.mat_vol,
                Match.nominal_time,
                Match.start_datetime,
                Match.end_datetime
            ).join(
                CombatType, CombatType.id == Match.combat_type_id
            ).join(
                CategoryType, CategoryType.id == Match.category_id
            ).join(
                SportType, SportType.id == Match.sport_id
            ).join(
                AllWeightClass, AllWeightClass.id == Match.weights_id
            ).where(Match.id == match_id))
        match_info = query.mappings().all()
        matches.append(match_info[0])

    result = matches
    return result


# Здесь надо переделать, узнать от фронта в каком формате приходят данные
@router.post("/{event_id}/matches/create")
async def create_match(
    event_id: int,
    match_data: MatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    # Проверка: есть юзер в списке оргазизаторов или нет
    query = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    # Проверяем этот ивент организовал юзер(организатор)
    query = await db.execute(
        select(Event.organizer_id)
        .where(Event.id == event_id)
    )
    event_org_id = query.scalars().all()
    query = await db.execute(
        select(EventOrganizer.id)
        .where(EventOrganizer.user_id == current_user.id)
    )
    event_org_current_id = query.scalars().all()

    if event_org_id != event_org_current_id:
        raise HTTPException(
            status_code=400, detail="You are not an organizer this event"
        )

    # логика
    # спорт id матча
    query = await db.execute(select(SportType.id).where(
        SportType.name == match_data.sport_type
    ))
    match_sport_type_id = query.scalars().first()

    # ID Ситстема проведения (Олимпийская, двойное выбывание, и прочее)
    query = await db.execute(select(CombatType.id).where(
        CombatType.name.ilike(f"%{match_data.combat_type}%")
    ))
    match_category_type_id = query.scalars().first()

    # ID Grade атлетов
    query = await db.execute(select(CategoryType.id).where(
        CategoryType.name.ilike(f"%{match_data.grade}%")
    ))
    match_grade_id = query.scalars().first()

    # Gender: мужской = True или женский = False
    if match_data.gender == "Мужчины":
        match_gender = True
    else:
        match_gender = False

    # Весовая категория участников
    query = await db.execute(
        select(AllWeightClass.id).where(
            and_(
                AllWeightClass.min_weight <= match_data.weight,
                AllWeightClass.max_weight >= match_data.weight
                )
            )
        )
    match_weights_id = query.scalars().first()

    # Время поединка в секундах
    time = re.search(r'^(\d+)\s', match_data.nominal_time)
    if time:
        match_nominal_time = int(time.group(1))

    nominal_time = match_nominal_time * 60

    new_match = Match(
        event_id=event_id,
        combat_type_id=match_category_type_id,
        start_datetime=match_data.start_datetime,
        nominal_time=nominal_time,
        mat_vol=match_data.mat_vol,
        end_datetime=match_data.start_datetime+timedelta(
            seconds=nominal_time
        )
    )
    db.add(new_match)
    await db.commit()

    match_sport = MatchSport(
        match_id=new_match.id,
        sport_id=match_sport_type_id
    )
    db.add(match_sport)

    match_weight = MatchWeights(
        match_id=new_match.id,
        weight_id=match_weights_id

    )
    db.add(match_weight)

    match_age = MatchAge(
        match_id=new_match.id,
        age_from=match_data.age_min,
        age_till=match_data.age_max
    )
    db.add(match_age)

    match_category = MatchCategory(
        match_id=new_match.id,
        category_id=match_grade_id
    )
    db.add(match_category)

    match_gender = MatchGender(
        match_id=new_match.id,
        gender=match_gender
    )
    db.add(match_gender)

    match_athlete_price = Engagement(
        match_id=new_match.id,
        price=match_data.price_athlete
    )
    db.add(match_athlete_price)

    match_spectator_price = Ticket(
        match_id=new_match.id,
        price=match_data.price
    )
    db.add(match_spectator_price)

    await db.commit()

    return {f"Match ID {new_match.id} - created"}


@router.get("/matches/{match_id}", response_model=MatchRead)
async def get_matches_id(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Подумать: если матч еще не прошел, что выводим?

    query = await db.execute(select(Match).where(Match.id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.put("/matches/update/{match_id}")
async def update_match(
    match_id: int,
    match_data: MatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):

    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Match).where(Match.id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    match.event_id = match_data.event_id
    match.start_datetime = match_data.start_datetime
    match.end_datetime = match_data.end_datetime
    match.combat_type_id = match_data.combat_type_id
    match.category_id = match_data.category_id
    match.nominal_time = match_data.nominal_time
    match.mat_vol = match_data.mat_vol
    await db.commit()
    return {f"Match ID - {match_id} updated"}


@router.post("/matches/delete/{match_id}")
async def delete_match(
    match_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Match).where(Match.id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    await db.delete(match)
    await db.commit()
    return {f"Match ID - {match_id} deleted"}


@router.post("/tournament-applications-team/create")
async def create_tournament_application_team(
    tournament_application_team_data: CreateTournamentApplicationTeam,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Team.captain).where(
        Team.id == tournament_application_team_data.team_id
    ))
    captain_id = query.scalars().first()

    query = await db.execute(select(Athlete.user_id).where(
        Athlete.id == captain_id
    ))
    user_id = query.scalars().first()

    if user_id != current_user.id:
        raise HTTPException(status_code=400, detail="You are not a captain")

    query = await db.execute(select(Match.id).where(
        Match.id == tournament_application_team_data.match_id
    ))
    match_id = query.scalars().first()

    if match_id is None:
        raise HTTPException(status_code=404, detail="Match not found")

    application = TournamentApplication(
        **tournament_application_team_data.dict()
    )
    db.add(application)
    await db.commit()
    db.refresh(application)

    return {f"Application ID - {application.id} created"}


@router.post("/tournament-applications-athlete/create")
async def create_tournament_application_athlete(
    tournament_application_athlete_data: CreateTournamentApplicationAthlete,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(
        select(Athlete.id)
        .where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalars().first()

    if athlete_id is None:
        raise HTTPException(status_code=400, detail="You are not an athlete")

    query = await db.execute(select(Match.id).where(
        Match.id == tournament_application_athlete_data.match_id
    ))
    match_id = query.scalars().first()

    if match_id is None:
        raise HTTPException(status_code=404, detail="Match not found")

    application = AthleteApplication(
        **tournament_application_athlete_data.dict()
    )
    db.add(application)
    await db.commit()
    db.refresh(application)

    return {f"Application ID - {application.id} created"}


@router.put("/tournament-applications/{application_id}/update")
async def update_tournament_application(
    application_id: int,
    update_application_data: UpdateTournamentApplication,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(TournamentApplication.match_id).where(
        TournamentApplication.id == application_id
    ))
    match_id = query.scalars().first()

    query = await db.execute(
        select(Match.event_id).where(Match.id == match_id)
    )
    event_id = query.scalars().first()

    query = await db.execute(select(Event.organizer_id).where(
        Event.id == event_id
    ))
    organizer_id = query.scalars().first()

    query = await db.execute(select(EventOrganizer.user_id).where(
        EventOrganizer.id == organizer_id
    ))
    user_id = query.scalars().first()

    if user_id != current_user.id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(TournamentApplication).where(
        TournamentApplication.id == application_id
    ))
    application = query.scalars().one_or_none()
    application.status = update_application_data.status

    await db.commit()

    new_status_history = ApplicationStatusHistory(
        application_id=application_id,
        status=update_application_data.status
    )
    db.add(new_status_history)
    await db.commit()

    return {f'Application ID - {application_id} updated'}
