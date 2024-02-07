from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi_pagination import paginate, Params

from connection import get_db
from auth.models import SystemAdministrator
from event.models import Event, Match, EventOrganizer
from event.shemas import EventCreate, MatchRead, MatchCreate, EventUpdate
from auth.schemas import UserDB
from auth.routes import current_user


router = APIRouter(prefix="/api", tags=["Events"])


@router.get("/events")
async def get_events(
    db: AsyncSession = Depends(get_db),
    params: Params = Depends()
):
    query = await db.execute(select(Event))
    return paginate(query.scalars().all(), params)


@router.get("/events/{event_id}")
async def get_events_id(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    params: Params = Depends()
):
    query = await db.execute(select(Event).where(Event.event_id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/events/create")
async def create_event(
    event_data: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()

    # Подумать: почему админ не добавляется в организаторы
    query_admin = await db.execute(select(SystemAdministrator.user_id))
    all_admin_id = query_admin.scalars().all()
    all_organizer_id.extend(all_admin_id)

    try:
        if current_user.id in all_organizer_id:
            event = Event(**event_data.dict())
            db.add(event)
            await db.commit()
            return {f"Event ID {event.event_id} - created"}
    except Exception:
        raise HTTPException(status_code=400, detail="You are not an organizer")


@router.put("/events/update/{event_id}")
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

    query = await db.execute(select(Event).where(Event.event_id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    event.name = event_data.name
    event.start_datetime = event_data.start_datetime
    event.end_datetime = event_data.end_datetime
    event.location = event_data.location
    await db.commit()
    return {f"Event ID - {event_id} updated"}


@router.post("/events/delete/{event_id}")
async def delete_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(Event).where(Event.event_id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return {f"Event ID - {event_id} deleted"}


@router.get("/matches")
async def get_participants(
    db: AsyncSession = Depends(get_db),
    params: Params = Depends()
):
    query = await db.execute(select(Match))
    return paginate(query.scalars().all(), params)


@router.get("/matches/{match_id}", response_model=MatchRead)
async def get_matches_id(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Подумать: если матч еще не прошел, что выводим?

    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.post("/matches/create")
async def create_match(
    match_data: MatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):

    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()
    if current_user.id not in all_organizer_id:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    match = Match(**match_data.dict())
    db.add(match)
    await db.commit()
    return {f"Match ID - {match.match_id} created"}


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

    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    match.event_id = match_data.event_id
    match.start_datetime = match_data.start_datetime
    match.end_datetime = match_data.end_datetime
    match.combat_type_id = match_data.combat_type_id
    match.round = match_data.round
    match.winner_id = match_data.winner_id
    match.category_id = match_data.category_id
    match.weight_class_id = match_data.weight_class_id
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

    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    await db.delete(match)
    await db.commit()
    return {f"Match ID - {match_id} deleted"}


@router.post("/matches/{match_id}/result")
async def set_result(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Match).where(Match.match_id == match_id))
    match = query.scalars().one_or_none()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    # подумать как заполнять таблицу результатов

    return {f"Match ID - {match_id} result set"}
