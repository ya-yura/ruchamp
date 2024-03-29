from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class MatchDB(BaseModel):
    event_id: Optional[int]
    combat_type_id: Optional[int]
    category_id: Optional[int]
    sport_id: Optional[int]
    weight_class_id: Optional[int]
    round: Optional[int]
    start_datetime: Optional[datetime]
    end_datetime: Optional[datetime]
    player_one: Optional[int]
    player_two: Optional[int]

    class Config:
        from_attributes = True
