from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

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
        "events.html", 
        {"request": request, "events": events}
    )
