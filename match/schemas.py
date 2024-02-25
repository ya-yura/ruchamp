from pydantic import BaseModel


class AgeCategoryCreate(BaseModel):
    id: int
    name: str
    min_age: str
    max_age: str


class MatchScore(BaseModel):
    score_player_one: int
    score_player_two: int
