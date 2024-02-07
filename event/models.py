from datetime import datetime
from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey
# from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import (
    EventOrganizer,
    CombatType,
    WeightClass,
    Team,
    Athlete,
)
from connection import Base


# Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata


class Event(Base):
    __tablename__ = "Event"
    event_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    location = Column(String, nullable=False)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id,
                                              ondelete="CASCADE"))
    event_order = Column(String, nullable=True)
    event_system = Column(String, nullable=True)


class Participant(Base):
    __tablename__ = "Participant"
    participant_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    # athlete_id = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.combat_type_id,
                                                ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(WeightClass.weight_class_id,
                                                 ondelete="CASCADE"))
    team_id = Column(Integer, ForeignKey(Team.id, ondelete="CASCADE"))


class Match(Base):
    __tablename__ = "Match"
    match_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.combat_type_id,
                                                ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey(WeightClass.weight_class_id,
                                             ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(WeightClass.weight_class_id,
                                                 ondelete="CASCADE"))
    round = Column(Integer, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    winner_id = Column(Integer, ForeignKey(Participant.participant_id,
                                           ondelete="CASCADE"))


class MatchResult(Base):
    __tablename__ = "MatchResult"
    result_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.match_id, ondelete="CASCADE"))
    winner_id = Column(Integer, ForeignKey(Participant.participant_id,
                                           ondelete="CASCADE"))
    loser_id = Column(Integer, ForeignKey(Participant.participant_id,
                                          ondelete="CASCADE"))
    score = Column(String, nullable=False)

class Prize(Base):
    __tablename__ = "Prize"
    prize_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    amount = Column(String, nullable=False)
    description = Column(String, nullable=False)

class Medal(Base):
    __tablename__ = "Medal"
    medal_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey(Participant.participant_id,
                                              ondelete="CASCADE"))
    medal_type = Column(String, nullable=False)
