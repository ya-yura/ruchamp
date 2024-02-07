from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


router = APIRouter(
    prefix="/pages",
    tags=["Frontend"]
)

templates = Jinja2Templates(directory='templates')

@router.get("/events")
async def get_event_page(request: Request):
    return templates.TemplateResponse("events.html", {"request": request})
