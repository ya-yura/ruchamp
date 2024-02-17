from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import AllWeightClass, CategoryType, Athlete

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
