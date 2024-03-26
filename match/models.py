import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import Athlete, AllWeightClass, CategoryType

Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata


# Категория по возрасту
class AgeCategory(Base):
    __tablename__ = "AgeCategory"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    min_age = Column(String, nullable=False)
    max_age = Column(String, nullable=False)


# временная таблица для сортировки
class TempDrawParticipants(Base):
    __tablename__ = 'Temp_draw_participants'
    id = Column(Integer, primary_key=True)
    athlete_id = Column(Integer, ForeignKey(Athlete.id))
    age_category = Column(Integer, ForeignKey(AgeCategory.id))
    weight_category = Column(Integer, ForeignKey(AllWeightClass.id))
    grade_category = Column(Integer, ForeignKey(CategoryType.id))
    gender = Column(Boolean, nullable=True)
    member_id = Column(Integer)


# временная таблица для обратной связи атлета и участника ивента
class TempAthlete(Base):
    __tablename__ = 'Temp_athlete'
    id = Column(Integer, primary_key=True)
    participant_id = Column(Integer)
    athlete_id = Column(Integer)
