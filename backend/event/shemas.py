from datetime import datetime, timedelta
from typing import Optional

from pydantic import BaseModel


class Event(BaseModel):
    event_id: int
    name: str
    start_datetime: datetime
    end_datetime: datetime
    location: str
    geo: str

    class Config:
        from_attributes = True


class EventCreate(BaseModel):
    name: str
    start_datetime: datetime = datetime.now()
    end_datetime: datetime = (datetime.now() + timedelta(days=1))
    location: str
    organizer_id: Optional[int]
    event_order: Optional[str] = None
    event_system: Optional[str] = None
    geo: Optional[str] = None


class EventUpdate(EventCreate):
    pass


class MatchRead(BaseModel):
    start_datetime: datetime = datetime.now()
    end_datetime: datetime = datetime.now() + timedelta(days=1)
    event_id: Optional[int]
    combat_type_id: Optional[int]
    category_id: Optional[int]
    weight_class_id: Optional[int]
    round: Optional[int]
    winner_id: Optional[int]

    class Config:
        from_attributes = True


class MatchCreate(MatchRead):
    event_id: Optional[int] = 1
    combat_type_id: Optional[int] = 1
    category_id: Optional[int] = 1
    weight_class_id: Optional[int] = 1
    round: Optional[int] = 1
    winner_id: Optional[int] = 1

    class Config:
        from_attributes = True
