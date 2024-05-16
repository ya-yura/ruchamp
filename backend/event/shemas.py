from datetime import datetime, timedelta
from typing import Optional

from pydantic import BaseModel


class Event(BaseModel):
    id: int
    name: str
    start_datetime: datetime
    end_datetime: datetime
    start_request_datetime: datetime
    end_request_datetime: datetime
    location: str
    geo: str
    description: str

    class Config:
        from_attributes = True


class EventCreate(BaseModel):
    name: str
    start_datetime: datetime = (datetime.now() + timedelta(days=31))
    end_datetime: datetime = (datetime.now() + timedelta(days=32))
    start_request_datetime: datetime = datetime.now()
    end_request_datetime: datetime = (datetime.now() + timedelta(days=30))
    location: str
    organizer_id: Optional[int]
    event_order: Optional[str] = None
    event_system: Optional[str] = None
    geo: Optional[str] = None
    description: Optional[str] = None


class EventUpdate(EventCreate):
    pass


class MatchRead(BaseModel):
    event_id: Optional[int]
    combat_type_id: Optional[int]
    category_id: Optional[int]  # Или здесть список должен быть? Или под каждый критерий создаем отдельный матч?
    nominal_time: Optional[int]
    mat_vol: Optional[int]
    start_datetime: datetime
    end_datetime: datetime

    class Config:
        from_attributes = True


class MatchCreate(BaseModel):
    sport_id: Optional[int]
    combat_type_id: Optional[int]
    category_id: Optional[int]  # Или здесть список должен быть? Или под каждый критерий создаем отдельный матч?
    age: Optional[int]
    weights_id: Optional[int]
    nominal_time: Optional[int]
    mat_vol: Optional[int]
    start_datetime: datetime = datetime.now()
    # end_datetime: datetime = datetime.now()

    class Config:
        from_attributes = True


class CreateTournamentApplication(BaseModel):
    team_id: int
    match_id: int
    status: str = 'accepted'

    class Config:
        from_attributes = True


class UpdateTournamentApplication(BaseModel):
    status: Optional[str]
