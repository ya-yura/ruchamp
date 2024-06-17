import os
import uuid
import re
from datetime import timedelta, datetime
import shutil

from aiofiles import open as async_open
from fastapi import (APIRouter, Depends, File, HTTPException,
                     UploadFile, Form)
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select, update, and_, case, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased
from sqlalchemy.exc import SQLAlchemyError

# from auth.models import SystemAdministrator
from auth.routes import current_user
from auth.schemas import UserDB
from auth.models import (SportType, Athlete, User, athlete_grade_association)
# from auth.models import User, athlete_sport_type_association
from connection import get_db
from event.models import (Event, EventOrganizer, Match, CombatType,
                          CategoryType, AllWeightClass, TournamentApplication,
                          ApplicationStatusHistory, MatchAge, MatchSport,
                          MatchGender, MatchCategory, WinnerTable,
                          MatchWeights, MatchParticipant, Medal,
                          SportType)
from event.shemas import (EventCreate, EventUpdate, MatchCreate,
                          MatchRead, CreateTournamentApplicationTeam,
                          CreateTournamentApplicationAthlete,
                          UpdateTournamentApplication)
from teams.models import Team
from shop.models import Ticket, Engagement, Sector, Place, Row, SpectatorTicket
from geo.geo import get_geo

router = APIRouter(prefix="/event", tags=["Events"])
templates = Jinja2Templates(directory='templates')


@router.get("/sports")
async def get_sports(
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(SportType.name))
    return query.scalars().all()


@router.get("/events")
async def get_events(
    db: AsyncSession = Depends(get_db)
):
    unique_sports_in_matches_info = []
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
            )
            .join(
                EventOrganizer, EventOrganizer.id == Event.organizer_id
            )
            .where(Event.id == event_id)
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
                select(MatchSport.sport_id)
                .where(MatchSport.match_id == match_id)
            )
            match_sport_id = query.scalars().all()

            for sport_id in match_sport_id:
                query = await db.execute(
                    select(SportType.name)
                    .where(SportType.id == sport_id)
                )
                sport_name = query.scalars().first()
                sports_in_matches_info.append(sport_name)
                unique_sports_in_matches_info = list(
                    set(sports_in_matches_info)
                )

        event_result = {k: v for k, v in event.items()}

        event_result["sports_in_matches"] = unique_sports_in_matches_info
        result.append(event_result)

    return result


'''@router.get("/events/me")
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
        )
        .join(
                EventOrganizer, EventOrganizer.id == Event.organizer_id
            )
        .where(Event.organizer_id == event_org_id)
    )
    events = query.mappings().all()

    return events'''


@router.get("/{event_id}/org-info")
async def get_event_org_info(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user),
):
    # Получение идентификатора организатора события
    query = await db.execute(
        select(Event.organizer_id)
        .where(Event.id == event_id)
    )
    event_org_id = query.scalars().first()

    if not event_org_id:
        raise HTTPException(status_code=404, detail="Event not found")

    # Проверка, является ли текущий пользователь организатором события
    query = await db.execute(
        select(EventOrganizer.user_id)
        .where(EventOrganizer.id == event_org_id)
    )
    org_user_id = query.scalars().first()
    if org_user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not an organizer this event"
        )

    # Получение всех матчей данного события
    query = await db.execute(
        select(Match.id)
        .where(Match.event_id == event_id)
    )
    match_ids = query.scalars().all()

    # Получение текущей даты и времени
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)

    # Добавить заявки от атлетов, не только от команд
    # Получение информации о командах и билетах
    query = await db.execute(
        select(TournamentApplication)
        .where(TournamentApplication.match_id.in_(match_ids))
    )
    total_applications_teams = query.scalars().all()

    PlaceAlias = aliased(Place)

    query = await db.execute(
        select(PlaceAlias.id)
        .join(Sector, Sector.event_id == event_id)
        .join(Row, Row.sector_id == Sector.id)
        .join(Place, Place.row_id == Row.id)
        .where(Event.id == event_id)
    )
    place_id = query.scalars().first()

    query = await db.execute(
        select(Ticket.price)
        .where(Ticket.match_id.in_(match_ids))
    )
    ticket_price = query.scalars().first()

    query = await db.execute(
        select(SpectatorTicket.id)
        .where(
            SpectatorTicket.match_id.in_(match_ids),
        )
    )
    tickets = query.scalars().all()

    query = await db.execute(
        select(Engagement.price)
        .where(Engagement.match_id.in_(match_ids))
    )
    engagement_price = query.scalars().first()

    query = await db.execute(
        select(TournamentApplication.id)
        .where(
            TournamentApplication.status == 'paid',
            TournamentApplication.match_id.in_(match_ids)
        )
    )
    paid_application = query.scalars().all()

    # Общая информация
    total_teams = len(total_applications_teams)
    total_teams_payed = sum(
        1 for team in total_applications_teams if team.status == "paid"
    )
    total_tickets = len(tickets)
    total_sold_tickets_price = sum(ticket_price for ticket in tickets)
    total_gain = sum(engagement_price for application in paid_application)

    # Информация за сегодня
    today_applications_teams_query = await db.execute(
        select(TournamentApplication)
        .where(
            TournamentApplication.match_id.in_(match_ids),
            TournamentApplication.created_at >= today_start
        )
    )
    today_applications_teams = today_applications_teams_query.scalars().all()

    query = await db.execute(
        select(TournamentApplication)
        .where(
            TournamentApplication.match_id.in_(match_ids),
            TournamentApplication.status == "paid",
            TournamentApplication.updated_at >= today_start
        )
    )
    today_applications_teams_paid = query.scalars().all()

    today_tickets_query = await db.execute(
        select(SpectatorTicket)
        .where(
            SpectatorTicket.match_id.in_(match_ids),
            SpectatorTicket.status == "paid",
            SpectatorTicket.updated_at >= today_start
        )
    )
    today_tickets = today_tickets_query.scalars().all()

    today_teams_count = len(today_applications_teams)
    today_teams_payed = sum(
        1 for team in today_applications_teams_paid if team.status == "paid"
    )
    #today_tickets = [1]  # заглушка надо подумать как взять сколько зрителей оплатило за сегодня
    today_tickets_count = len(today_tickets)
    today_sold_tickets_price = sum(ticket_price for ticket in today_tickets)

    org_info = {
        "total": {
            "teams": total_teams,
            "teams_payed": total_teams_payed,
            "tickets": total_tickets,
            "sold_tickets_price": total_sold_tickets_price,
            "total_gain": total_gain
        },
        "today": {
            "teams": today_teams_count,
            "teams_payed": today_teams_payed,
            "tickets": today_tickets_count,
            "sold_tickets_price": today_sold_tickets_price
        }
    }

    return org_info


@router.get("/{event_id}/org-info/application")
async def get_event_applications(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    # current_user: UserDB = Depends(current_user)
):

    '''# Получение идентификатора организатора события
    query = await db.execute(
        select(Event.organizer_id)
        .where(Event.id == event_id)
    )
    event_org_id = query.scalars().first()

    if not event_org_id:
        raise HTTPException(status_code=404, detail="Event not found")

    # Проверка, является ли текущий пользователь организатором события
    query = await db.execute(
        select(EventOrganizer.user_id)
        .where(EventOrganizer.id == event_org_id)
    )
    org_user_id = query.scalars().first()
    if org_user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not an organizer this event"
        )'''

    # Получение идентификаторов матчей для события
    query = await db.execute(
        select(Match.id).where(Match.event_id == event_id)
    )
    match_ids = query.scalars().all()

    if not match_ids:
        raise HTTPException(
            status_code=404, detail="No matches found for this event"
        )

    # Получение заявок на матчи
    query = await db.execute(
        select(TournamentApplication.status)
        .distinct()
        .where(TournamentApplication.match_id.in_(match_ids))
    )
    applications_status = query.scalars().all()

    if not applications_status:
        raise HTTPException(
            status_code=404, detail="No applications found for this event"
        )

    application_info = {}

    for status in applications_status:
        application_info[status] = []

        query = await db.execute(
            select(
                TournamentApplication.team_id
            )
            .where(TournamentApplication.status == status)
        )
        teams = query.scalars().all()

        # Используем множество для удаления повторений
        unique_teams = set(teams)

        for team_id in unique_teams:
            team_query = await db.execute(
                select(Team.id, Team.name)
                .where(Team.id == team_id)
            )
            team = team_query.mappings().first()

            if not team:
                continue

            team_info = {
                "id": team["id"],
                "name": team["name"],
                "members": []
            }

            # Получение информации об участниках команды
            members_query = await db.execute(
                select(
                    TournamentApplication.athlete_id
                )
                .where(
                    TournamentApplication.status == status,
                    TournamentApplication.team_id == team_id
                )
            )
            members = members_query.scalars().all()

            for member in members:

                athlete_query = await db.execute(
                    select(
                        User.id,
                        User.sirname,
                        User.name,
                        User.fathername,
                        User.birthdate,
                        User.gender,
                        Athlete.height,
                        Athlete.weight,
                        Athlete.image_field,
                        Athlete.country,
                        Athlete.region,
                        Athlete.city,
                        CategoryType.name.label("grade_type"),
                    )
                    .join(User, User.id == Athlete.user_id)
                    .where(Athlete.id == member)
                )
                athlete = athlete_query.first()

                query = await db.execute(
                    select(
                        CategoryType.name
                    )
                    .join(athlete_grade_association)
                    .where(
                        athlete_grade_association.c.athlete_id == member
                    )
                )
                grade_types = query.scalars().all()

                member_info = {
                    "id": athlete.id,
                    "sirname": athlete.sirname,
                    "name": athlete.name,
                    "fathername": athlete.fathername,
                    "birthdate": str(athlete.birthdate),
                    "gender": athlete.gender,
                    "height": athlete.height,
                    "weight": athlete.weight,
                    "image_field": athlete.image_field,
                    "country": athlete.country,
                    "region": athlete.region,
                    "city": athlete.city,
                    "grade_types": [grade_type for grade_type in grade_types]
                }
                team_info["members"].append(member_info)

            application_info[status].append(team_info)

    return application_info


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
        EventOrganizer.id.label("organizer_id"),
        EventOrganizer.contact_phone.label("contact_phone"),
        EventOrganizer.contact_email.label("contact_email"),
        EventOrganizer.website.label("website"),
        EventOrganizer.image_field.label("image"),
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
    print(matches_id)
    sports_in_matches_info = []
    for match_id in matches_id:
        query = await db.execute(
            select(MatchSport.sport_id)
            .where(MatchSport.match_id == match_id)
        )
        match_sport_id = query.scalars().all()
        print(match_sport_id)
        for sport_id in match_sport_id:
            query = await db.execute(
                select(SportType.name).where(SportType.id == sport_id)
            )
            sport_name = query.scalars().first()
            sports_in_matches_info.append(sport_name)
    sports_in_matches_info_unique = list(set(sports_in_matches_info))
    event_result = {k: v for k, v in event.items()}
    event_result["sports_in_matches"] = sports_in_matches_info_unique
    result.append(event_result)

    return result


@router.post("/create")
async def create_event(
    name: str = Form(...),
    start_datetime: datetime = Form(...),
    end_datetime: datetime = Form(...),
    start_request_datetime: datetime = Form(...),
    end_request_datetime: datetime = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    geo: str = Form(...),
    image: UploadFile = File(...),
    event_order: UploadFile = File(...),
    event_system: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    try:
        event_data = EventCreate(
            name=name,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            start_request_datetime=start_request_datetime,
            end_request_datetime=end_request_datetime,
            location=location,
            description=description,
            geo=geo,
        )

        query = await db.execute(
            select(EventOrganizer.id)
            .where(EventOrganizer.user_id == current_user.id)
        )
        org_id = query.scalars().one_or_none()

        query = await db.execute(select(EventOrganizer.user_id))
        all_organizer_id = query.scalars().all()

        # Подумать: почему админ не добавляется в организаторы
        # query_admin = await db.execute(select(SystemAdministrator.user_id))
        # all_admin_id = query_admin.scalars().all()
        # all_organizer_id.extend(all_admin_id)

        if current_user.id not in all_organizer_id:
            raise HTTPException(
                status_code=400, detail="You are not an organizer"
            )

        # Создание директории для хранения изображений, если она не существует
        base_dir = "static"
        image_dir = os.path.join(base_dir, "images")
        files_dir = os.path.join(base_dir, "files")
        os.makedirs(image_dir, exist_ok=True)
        os.makedirs(files_dir, exist_ok=True)

        image_location = os.path.join(image_dir, image.filename)
        event_order_location = os.path.join(files_dir, event_order.filename)
        event_system_location = os.path.join(files_dir, event_system.filename)

        # Сохранение изображения на сервере
        with open(image_location, "wb") as file:
            shutil.copyfileobj(image.file, file)

        # Сохранение файлов на сервере
        with open(event_order_location, "wb") as file:
            shutil.copyfileobj(event_order.file, file)

        with open(event_system_location, "wb") as file:
            shutil.copyfileobj(event_system.file, file)

        new_event = Event(
            name=event_data.name,
            start_datetime=event_data.start_datetime,
            end_datetime=event_data.end_datetime,
            start_request_datetime=event_data.start_request_datetime,
            end_request_datetime=event_data.end_request_datetime,
            location=event_data.location,
            organizer_id=org_id,
            event_order=event_order_location,
            event_system=event_system_location,
            description=event_data.description,
            geo=event_data.geo,
            image_field=image_location,
        )
        db.add(new_event)
        await db.commit()

        return new_event.id

    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


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
    image_path = os.path.join("static/images", image_name)

    # Запись файла на диск
    try:
        async with async_open(image_path, 'wb') as f:
            await f.write(await image.read())
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while saving the file: {str(e)}"
        )

    event.image_field = f"/static/images/{image_name}"
    await db.commit()

    return {f"Event {event_id} updated"}


'''@router.post("/update-geo/{event_id}")
async def update_geo_in_event(event_id: int,
                              db: AsyncSession = Depends(get_db)):

    query = await db.execute(select(Event.location).where(
        Event.id == event_id))

    location = query.scalars().one_or_none()
    geo = str(get_geo(location))

    await db.execute(update(Event).where(
        Event.id == event_id).values(geo=geo))

    await db.commit()
    return {f"Events {event_id} updated"}'''


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
    event.geo = event_data.geo
    await db.commit()
    return {f"Event ID - {event_id} updated"}


@router.delete("/delete/{event_id}")
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

    query = await db.execute(
        select(Match.id)
        .where(Match.event_id == event_id)
    )
    matches_in_event = query.scalars().all()

    if matches_in_event != []:
        raise HTTPException(status_code=404, detail="Event has matches")

    query = await db.execute(
        select(Event.organizer_id)
        .where(Event.id == event_id)
    )
    org_id = query.scalars().one_or_none()
    query = await db.execute(
        select(EventOrganizer.user_id)
        .where(EventOrganizer.id == org_id)
    )
    org_user_id = query.scalars().one_or_none()

    if org_user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="You not organizer this Event"
        )

    await db.delete(event)
    await db.commit()
    return {f"Event ID - {event_id} deleted"}


@router.get("/{event_id}/matches")
async def get_matches(
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
                Match.id,
                Match.name,
                Match.start_datetime,
                Match.end_datetime,
                SportType.name.label("sport_name"),
                MatchAge.age_from.label("age_min"),
                MatchAge.age_till.label("age_max"),
                MatchGender.gender.label("gender"),
                AllWeightClass.name.label("weight_category"),
                AllWeightClass.min_weight.label("weight_min"),
                AllWeightClass.max_weight.label("weight_max"),
                CategoryType.name.label("category_type"),
            )
            .join(CombatType, CombatType.id == Match.combat_type_id)
            .join(MatchSport, MatchSport.match_id == Match.id)
            .join(SportType, SportType.id == MatchSport.sport_id)
            .join(MatchAge, MatchAge.match_id == Match.id)
            .join(MatchGender, MatchGender.match_id == Match.id)
            .join(MatchWeights, MatchWeights.match_id == Match.id)
            .join(AllWeightClass, AllWeightClass.id == MatchWeights.weight_id)
            .join(MatchCategory, MatchCategory.match_id == Match.id)
            .join(CategoryType, CategoryType.id == MatchCategory.category_id)
            .where(Match.id == match_id))
        match_info = query.mappings().all()
        matches.append(match_info[0])

    return matches


@router.get("/{event_id}/matches-results")
async def get_event_matches_results(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Получаем все матчи для данного мероприятия
    query = await db.execute(
        select(Match.id).where(Match.event_id == event_id)
    )
    match_ids = query.scalars().all()

    if not match_ids:
        raise HTTPException(
            status_code=404,
            detail="No matches found for the event"
        )
    participants = []
    # Получаем всех участников матчей в ивенте
    for match_id in match_ids:
        query = await db.execute(
            select(MatchParticipant.player_id)
            .where(MatchParticipant.match_id == match_id)
        )
        participant_ids = query.scalars().all()
        participants.extend(participant_ids)

    if not participant_ids:
        raise HTTPException(
            status_code=404,
            detail="No participants found for the event"
        )

    results = []

    for participant_id in participants:
        # Получаем ID пользователя спортсмена
        query = await db.execute(
            select(Athlete.user_id).where(Athlete.id == participant_id)
        )
        user_id = query.scalar_one_or_none()
        if user_id is None:
            continue

        # Получаем информацию о пользователе и спортсмене
        query = await db.execute(
            select(
                User.id,
                User.sirname,
                User.name,
                User.fathername,
                User.birthdate,
                User.gender,
                Athlete.height,
                Athlete.weight,
                Athlete.image_field,
                Athlete.country,
                Athlete.region,
                Athlete.city,
            )
            .join(Athlete, Athlete.user_id == user_id)
            .where(User.id == user_id)
        )
        users = query.mappings().all()
        if not users:
            continue

        user = users[0]
        user_info = {key: value for key, value in user.items()}

        # Инициализируем медаль и очки
        user_info['medal'] = 'none'
        user_info['points'] = 0

        query = await db.execute(
            select(MatchParticipant.id)
            .where(MatchParticipant.player_id == participant_id)
        )
        match_participant_ids = query.scalars().all()

        for winner_id in match_participant_ids:
            # Получаем медали для каждого участника
            query = await db.execute(
                select(WinnerTable.medal)
                .where(WinnerTable.winner_id == winner_id)
            )
            medal_id = query.scalars().first()

            query = await db.execute(
                select(Medal.medal_type).where(Medal.id == medal_id)
            )
            medal_type = query.scalar_one_or_none()
            if medal_type == "Золото":
                user_info['medal'] = 'gold'
            elif medal_type == "Серебро":
                user_info['medal'] = 'silver'
            elif medal_type == "Бронза":
                user_info['medal'] = 'bronze'

            query = await db.execute(
                select(WinnerTable.winner_score)
                .where(WinnerTable.winner_id == winner_id)
            )
            scores = query.scalars().one_or_none()
            user_info['points'] += int(scores) if scores else 0

        results.append(user_info)

    return results


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
    min_weight_id_subquery = select(
        func.min(AllWeightClass.id)
    ).scalar_subquery()
    max_weight_id_subquery = select(
        func.max(AllWeightClass.id)
    ).scalar_subquery()

    query = await db.execute(
        select(
            case(
                    (
                        and_(
                            AllWeightClass.min_weight <= match_data.weight,
                            AllWeightClass.max_weight >= match_data.weight
                        ),
                        AllWeightClass.id
                    ),
                    (
                        match_data.weight < AllWeightClass.min_weight,
                        max_weight_id_subquery
                    ),
                    (
                        match_data.weight > AllWeightClass.max_weight,
                        min_weight_id_subquery
                    )
                )
            )
        )
    match_weights_id = query.scalars().first()

    # Время поединка в секундах
    time = re.search(r'^(\d+)\s', match_data.nominal_time)
    if time:
        match_nominal_time = int(time.group(1))

    nominal_time = match_nominal_time * 60

    if match_data.age_min == 0 or match_data.age_max == 0:
        raise HTTPException(status_code=400, detail="Age is not set")
    elif match_data.weight == 0:
        raise HTTPException(status_code=400, detail="Weight is not set")
    else:
        new_match = Match(
            name=match_data.name,
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

        ticket_sector = Sector(
            event_id=event_id,
            name="Сектор"
        )
        db.add(ticket_sector)
        await db.flush()

        ticket_row = Row(
            sector_id=ticket_sector.id,
            number=1
        )
        db.add(ticket_row)
        await db.flush()

        ticket_place = Place(
            row_id=ticket_row.id,
            number=match_data.seat_capacity
        )
        db.add(ticket_place)
        await db.flush()

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


'''@router.get("/matches/{match_id}", response_model=MatchRead)
async def get_matches_id(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Подумать: если матч еще не прошел, что выводим?

    query = await db.execute(select(Match).where(Match.id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match'''


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


@router.delete("/matches/delete/{match_id}")
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


@router.post("/tournament-applications-team/paid/{team_id}")
async def team_paid_tournament_application(
    team_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(
        select(TournamentApplication.id)
        .where(TournamentApplication.team_id == team_id)
    )
    application_id = query.scalars().first()
    new_status_history = ApplicationStatusHistory(
        application_id=application_id,
        status="paid"
    )
    db.add(new_status_history)
    await db.commit()
    return {f"Application ID - {application_id} paid"}


@router.post("/tournament-applications-athlete/create")
async def create_tournament_application_athlete(
    tournament_application_athlete_data: CreateTournamentApplicationAthlete,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(User.id).where(User.id == current_user.id))
    user_id = query.scalars().first()
    if user_id is None:
        raise HTTPException(status_code=400, detail="You are not registered ")

    query = await db.execute(
        select(Athlete.id)
        .where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalars().first()
    if athlete_id is None:
        raise HTTPException(
            status_code=400, detail="You are not registered as an athlete"
        )

    query = await db.execute(select(Match.id).where(
        Match.id == tournament_application_athlete_data.match_id
    ))
    match_id = query.scalars().first()

    if match_id is None:
        raise HTTPException(status_code=404, detail="Match not found")

    application = TournamentApplication(
        team_id=0,
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
