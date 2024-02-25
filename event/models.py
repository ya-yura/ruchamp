from datetime import datetime
from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey, Table
# from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import relationship

from auth.models import (
    EventOrganizer,
    CombatType,
    AllWeightClass,
    Athlete,
    CategoryType,
    SportType,
)
from teams.models import (
    Team,
    TeamMember,
)
from connection import Base


metadata = Base.metadata


# Спортивное событие
class Event(Base):
    __tablename__ = "Event"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    location = Column(String, nullable=False)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id, ondelete="CASCADE"))
    event_order = Column(String, nullable=True) # Это документы, которые будут прикладываться
    event_system = Column(String, nullable=True) # и это
    geo = Column(String, nullable=True)


# Весовые категории события
class EventWeights(Base):
    __tablename__ = "EventWeights"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    weight_id = Column(Integer, ForeignKey(AllWeightClass.id, ondelete="CASCADE"))


# Виды спорта в событии
class EventSports(Base):
    __tablename__ = "EventSports"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    sport_id = Column(Integer, ForeignKey(SportType.id, ondelete="CASCADE"))


# Участник спортивного события
class Participant(Base):
    __tablename__ = "Participant"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    player_id = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))


# Матч
class Match(Base):
    __tablename__ = "Match"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    combat_type_id = Column(Integer, ForeignKey(CombatType.id, ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey(CategoryType.id, ondelete="CASCADE"))
    weight_class_id = Column(Integer, ForeignKey(AllWeightClass.id, ondelete="CASCADE"))
    round = Column(Integer, nullable=False)
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)

    # бойцы временно переделаны на Атлета а не участник команды
    # возникли сложности с моделями
    player_one = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))
    player_two = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))
    winner_id = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))

    periods = relationship("MatchPeriod", backref="match", cascade="all, delete-orphan")
    results = relationship("MatchResult", backref="match", cascade="all, delete-orphan")


# Период матча
class MatchPeriod(Base):
    __tablename__ = "MatchPeriod"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    start_datetime = Column(TIMESTAMP, nullable=False)
    end_datetime = Column(TIMESTAMP, nullable=False)
    winner_score = Column(String, nullable=False)
    loser_score = Column(String, nullable=False)


# Результаты матча
class MatchResult(Base):
    __tablename__ = "MatchResult"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    winner_score = Column(String, nullable=False)
    loser_score = Column(String, nullable=False)


# Приз
class Prize(Base):
    __tablename__ = "Prize"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    amount = Column(String, nullable=False)
    description = Column(String, nullable=False)


# Медаль
class Medal(Base):
    __tablename__ = "Medal"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey(Participant.id, ondelete="CASCADE"))
    medal_type = Column(String, nullable=False)
