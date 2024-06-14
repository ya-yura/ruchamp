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
    description: Optional[str] = None
    geo: Optional[str] = None


class EventUpdate(EventCreate):
    pass


class MatchRead(BaseModel):
    event_id: Optional[int]
    combat_type_id: Optional[int]
    category_id: Optional[int]
    nominal_time: Optional[int]
    mat_vol: Optional[int]
    start_datetime: datetime
    end_datetime: datetime

    class Config:
        from_attributes = True


class MatchCreate(BaseModel):
    name: Optional[str] = None
    sport_type: str = "Дзюдо"
    combat_type: str = "Олимпийская система"
    grade: str = "1-й юношеский разряд"
    gender: str = "Мужчины"
    age_min: int  # Возраст от
    age_max: int  # Возраст до
    weight: float  # Вес до
    nominal_time: str = "10 минут"
    mat_vol: Optional[int] = 4
    start_datetime: datetime = datetime.now()
    price: Optional[float] = None
    seat_capacity: Optional[int] = None
    price_athlete: Optional[float] = None

    class Config:
        from_attributes = True


class CreateTournamentApplicationTeam(BaseModel):
    team_id: int
    match_id: int
    status: str = 'accepted'

    class Config:
        from_attributes = True


class CreateTournamentApplicationAthlete(BaseModel):
    athlete_id: int
    match_id: int
    status: str = 'accepted'

    class Config:
        from_attributes = True


class UpdateTournamentApplication(BaseModel):
    status: Optional[str]
