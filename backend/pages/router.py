from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from connection import get_db
from event.models import Event
from event.routers import get_events

router = APIRouter(
    prefix="/pages",
    tags=["Frontend"]
)

templates = Jinja2Templates(directory='templates')


@router.get("/events")
async def get_event_page(
    request: Request,
    events=Depends(get_events)):
    return templates.TemplateResponse(
        "events.html", {'request': request, 'events': events}
    )


@router.get("/event/{event_id}")
async def get_events_id(
    request: Request,
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Event).where(Event.event_id == event_id))
    event = query.scalars().one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return templates.TemplateResponse(
        "event.html", {'request': request, 'event': event}
    )
