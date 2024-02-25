import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import AllWeightClass, CategoryType, Athlete, Referee
from event.models import Participant, Event, Match
from teams.models import TeamMember


Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata


# Категория по возрасту ()
class AgeCategory(Base):
    __tablename__ = "AgeCategory"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    min_age = Column(String, nullable=False)
    max_age = Column(String, nullable=False)


class TempDrawParticipants(Base):
    __tablename__ = 'Temp_draw_participants'
    id = Column(Integer, primary_key=True)
    athlete_id = Column(Integer, ForeignKey(Athlete.id))
    age_category = Column(Integer, ForeignKey(AgeCategory.id))
    weight_category = Column(Integer, ForeignKey(AllWeightClass.id))
    grade_category = Column(Integer, ForeignKey(CategoryType.id))
    member_id = Column(Integer)


class TempAthlete(Base):
    __tablename__ = 'Temp_athlete'
    id = Column(Integer, primary_key=True)
    participant_id = Column(Integer)
    athlete_id = Column(Integer)


# Очки, которые выставляют судьи участникам поединков
class Score(Base):
    __tablename__ = 'Score'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id))
    match_id = Column(Integer, nullable=True)
    player_one = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))
    score_player_one = Column(Integer, nullable=True)
    player_two = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))
    score_player_two = Column(Integer, nullable=True)
    referee_id = Column(Integer, ForeignKey(Referee.id), nullable=True)
    time = Column(DateTime, default=datetime.datetime.utcnow)
