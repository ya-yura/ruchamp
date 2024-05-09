import os
import uuid

from aiofiles import open as async_open
from fastapi import (APIRouter, Depends, File, HTTPException, Request,
                     UploadFile)
from fastapi.templating import Jinja2Templates
from fastapi_pagination import Params, paginate
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

# from auth.models import SystemAdministrator
from auth.routes import current_user
from auth.schemas import UserDB
from connection import get_db
from event.models import Event, EventOrganizer, Match
from event.shemas import EventCreate, EventUpdate, MatchCreate, MatchRead
from geo.geo import get_geo

router = APIRouter(prefix="/event", tags=["Events"])
templates = Jinja2Templates(directory='templates')


@router.get("/events")
async def get_events(
    db: AsyncSession = Depends(get_db),
    params: Params = Depends()
):
    query = await db.execute(select(Event))
    return query.scalars().all()


@router.get("/{event_id}")
async def get_events_id(
    request: Request,
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Event.id,
        Event.name,
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
    ).where(Event.id == event_id))
    event = query.mappings().all()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    query = await db.execute(select(Event.organizer_id).where(Event.id == event_id))
    event_organizer_id = query.scalars().first()
    query = await db.execute(select(EventOrganizer.organization_name).where(EventOrganizer.id == event_organizer_id))
    organizer = query.mappings().all()
    event_info = event
    org_info = organizer[0]
    # result = event_info | org_info
    # print(result)

    return event_info


@router.post("/create")
async def create_event(
    event_data: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query_org = await db.execute(select(EventOrganizer.user_id))
    all_organizer_id = query_org.scalars().all()

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
    db: AsyncSession = Depends(get_db),
    params: Params = Depends()
):
    query = await db.execute(select(Match).where(Match.event_id == event_id))
    return paginate(query.scalars().all(), params)


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


# Подумать надо нам это или нет?
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

    new_match = Match(**match_data.dict())
    db.add(new_match)
    await db.commit()
    return {f"Match ID - {new_match.id} created"}


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
