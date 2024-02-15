from datetime import datetime
from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey
# from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import relationship

from auth.models import (
    EventOrganizer,
    CombatType,
    AllWeightClass,
    Athlete,
    CategoryType,
)
from teams.models import (
    Team,
)
from connection import Base


metadata = Base.metadata

# Спортивное событие
class Event(Base):
    __tablename__ = "Event"
    event_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    location = Column(String, nullable=False)
    combat_type_id = Column(Integer, ForeignKey(CombatType.id, ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(AllWeightClass.id, ondelete="CASCADE"))
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id, ondelete="CASCADE"))
    event_order = Column(String, nullable=True) # Это докуенты, которые будут прикладываться
    event_system = Column(String, nullable=True) # и это
    geo = Column(String, nullable=True)


# Участник спортивного события
class Participant(Base):
    __tablename__ = "Participant"
    participant_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    team_id = Column(Integer, ForeignKey(Team.id, ondelete="CASCADE"))


# Матч
class Match(Base):
    __tablename__ = "Match"
    match_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.id, ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey(CategoryType.id, ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(AllWeightClass.id, ondelete="CASCADE"))
    round = Column(Integer, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    player_one = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    player_two = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    winner_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    periods = relationship("MatchPeriod", backref="match", cascade="all, delete-orphan")
    results = relationship("MatchResult", backref="match", cascade="all, delete-orphan")


# Период матча
class MatchPeriod(Base):
    __tablename__ = "MatchPeriod"
    period_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.match_id, ondelete="CASCADE"))
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    winner_score = Column(String, nullable=False)
    loser_score = Column(String, nullable=False)


# Результаты матча
class MatchResult(Base):
    __tablename__ = "MatchResult"
    result_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.match_id, ondelete="CASCADE"))
    winner_score = Column(String, nullable=False)
    loser_score = Column(String, nullable=False)


# Приз
class Prize(Base):
    __tablename__ = "Prize"
    prize_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    amount = Column(String, nullable=False)
    description = Column(String, nullable=False)


# Медаль
class Medal(Base):
    __tablename__ = "Medal"
    medal_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    medal_type = Column(String, nullable=False)
