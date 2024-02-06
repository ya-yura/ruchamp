from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, Table
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import (
    EventOrganizer,
    CombatType,
    Category,
    WeightClass,
    Team,
    
)

Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata

athlete_combat_type_association = Table(
    'athlete_combat_type_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('combat_type_id', Integer, ForeignKey('CombatType.combat_type_id'))
)

athlete_coach_association = Table(
    'athlete_coach_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('coach_id', Integer, ForeignKey('Coach.coach_id'))
)

class Event(Base):
    __tablename__ = "Event"
    event_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    location = Column(String, nullable=False)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id, ondelete="CASCADE"))
    event_order = Column(String, nullable=True)
    event_system = Column(String, nullable=True)
    

class Participant(Base):
    __tablename__ = "Participant"
    participant_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.combat_type_id, ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey(Category.category_id, ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(WeightClass.weight_class_id, ondelete="CASCADE"))
    name = Column(String, nullable=False)
    birth_date = Column(TIMESTAMP, nullable=False)
    team_id = Column(Integer, ForeignKey(Team.team_id, ondelete="CASCADE"))
    
    event = relationship("Event", back_populates="participants")
    combat_type = relationship("CombatType", back_populates="participants")
    category = relationship("Category", back_populates="participants")
    weight_class = relationship("WeightClass", back_populates="participants")


class Match(Base):
    __tablename__ = "Match"
    match_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.combat_type_id, ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey(Category.category_id, ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(WeightClass.weight_class_id, ondelete="CASCADE"))
    round = Column(Integer, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    winner_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    
    event = relationship("Event", back_populates="matches")
    combat_type = relationship("CombatType", back_populates="matches")
    category = relationship("Category", back_populates="matches")
    weight_class = relationship("WeightClass", back_populates="matches")
    winner = relationship("Participant", foreign_keys=[winner_id], back_populates="won_matches")


class MatchResult(Base):
    __tablename__ = "MatchResult"
    result_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.match_id, ondelete="CASCADE"))
    winner_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    loser_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    score = Column(String, nullable=False)
    
    match = relationship("Match", back_populates="result")
    winner = relationship("Participant", foreign_keys=[winner_id], back_populates="won_results")
    loser = relationship("Participant", foreign_keys=[loser_id], back_populates="lost_results")


class Prize(Base):
    __tablename__ = "Prize"
    prize_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    amount = Column(String, nullable=False)
    description = Column(String, nullable=False)
    
    event = relationship("Event", back_populates="prizes")


class Medal(Base):
    __tablename__ = "Medal"
    medal_id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.event_id, ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey(Participant.participant_id, ondelete="CASCADE"))
    medal_type = Column(String, nullable=False)
    
    event = relationship("Event", back_populates="medals")
    recipient = relationship("Participant", back_populates="awarded_medals")
