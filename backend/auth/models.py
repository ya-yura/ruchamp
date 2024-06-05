from datetime import datetime

from sqlalchemy import (JSON, TIMESTAMP, Boolean, Column, Date,
                        Float, ForeignKey, Integer, String, Table)
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import relationship

Base: DeclarativeMeta = declarative_base()
metadata = Base.metadata


# --------------- GEO ------------------

class Country(Base):
    __tablename__ = "Country"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class Region(Base):
    __tablename__ = "Region"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("Country.id", ondelete="CASCADE"))
    country = relationship("Country", back_populates="regions")
    areas = relationship("Area", back_populates="region")


Country.regions = relationship("Region", back_populates="country")


class Area(Base):
    __tablename__ = "Area"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    region_id = Column(Integer, ForeignKey("Region.id", ondelete="CASCADE"))
    region = relationship("Region", back_populates="areas")


athlete_sport_type_association = Table(
    'athlete_sport_type_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('sport_type_id', Integer, ForeignKey('SportType.id'))
)

athlete_coach_association = Table(
    'athlete_coach_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('coach_id', Integer, ForeignKey('Coach.id'))
)

athlete_grade_association = Table(
    'athlete_grade_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('category_type_id', Integer, ForeignKey('CategoryType.id'))
)


# Роли пользователей (спортсмен, зритель, судья, организатор, сисадмин)
class Role(Base):
    __tablename__ = "Role"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    permissions = Column(JSON)


# тип заполнения турнирной сетки
class CombatType(Base):
    __tablename__ = "CombatType"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# категории судей
class RefereeType(Base):
    __tablename__ = "RefereeType"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


# категории тренеров
class CoachType(Base):
    __tablename__ = "CoachType"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


# категории спортсмена (кмс, мс и пр)
class CategoryType(Base):
    __tablename__ = "CategoryType"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    athletes = relationship(
        'Athlete',
        secondary=athlete_grade_association,
        back_populates='grades'
    )


# Виды спорта, которые фигурируют в системе
class SportType(Base):
    __tablename__ = "SportType"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    athletes = relationship(
        'Athlete',
        secondary=athlete_sport_type_association,
        back_populates='sport_types'
    )


# классы веса (супертяж, тяж и пр)
class AllWeightClass(Base):
    __tablename__ = "AllWeightClass"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    min_weight = Column(Float, nullable=False)
    max_weight = Column(Float, nullable=False)


# тренер
class Coach(Base):
    __tablename__ = "Coach"
    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=True)
    sirname = Column(String, nullable=True)
    fathername = Column(String, nullable=True)
    gender = Column(Boolean, default=True, nullable=True)
    country = Column(String, nullable=True)
    birthdate = Column(Date, nullable=True)
    qualification_level = Column(
        Integer,
        ForeignKey(CoachType.id, ondelete="CASCADE"),
        nullable=True
    )

    athletes = relationship(
        "Athlete",
        secondary=athlete_coach_association,
        back_populates="coaches"
    )


# пользователь системы
class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    registered_at = Column(TIMESTAMP, default=datetime.utcnow)
    role_id = Column(Integer, ForeignKey(Role.id))

    name = Column(String, nullable=True)
    sirname = Column(String, nullable=True)
    fathername = Column(String, nullable=True)
    gender = Column(Boolean, default=True, nullable=True)
    birthdate = Column(Date, nullable=True)

    hashed_password = Column(String(length=1024), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True)


# судья
class Referee(Base):
    __tablename__ = "Referee"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    qualification_level = Column(
        Integer, ForeignKey(RefereeType.id, ondelete="CASCADE")
    )
    image_field = Column(String, nullable=True)


# спортсмен
class Athlete(Base):
    __tablename__ = "Athlete"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('User.id', ondelete="CASCADE"))
    weight = Column(Float, nullable=True)
    height = Column(Integer, nullable=True)
    image_field = Column(String, nullable=True)
    country = Column(Integer, ForeignKey(Country.id, ondelete="CASCADE"))
    city = Column(String, nullable=True)
    region = Column(Integer, ForeignKey(Region.id, ondelete="CASCADE"))

    sport_types = relationship(
        'SportType',
        secondary=athlete_sport_type_association,
        back_populates='athletes'
    )
    coaches = relationship(
        'Coach',
        secondary=athlete_coach_association,
        back_populates='athletes'
    )
    grades = relationship(
        'CategoryType',
        secondary=athlete_grade_association,
        back_populates='athletes'
    )


# Отношение атлет - спорт - грейд
class AthleteSport(Base):
    __tablename__ = "AthleteSport"
    id = Column(Integer, primary_key=True)
    athlete_id = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
    sport_id = Column(Integer, ForeignKey(SportType.id, ondelete="CASCADE"))
    grade_id = Column(Integer, ForeignKey(CategoryType.id, ondelete="CASCADE"))


# организатор
class EventOrganizer(Base):
    __tablename__ = "EventOrganizer"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    organization_name = Column(String, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image_field = Column(String, nullable=True)


# зритель
class Spectator(Base):
    __tablename__ = "Spectator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    phone_number = Column(String, nullable=True)
    image_field = Column(String, nullable=True)


# сисадмин
class SystemAdministrator(Base):
    __tablename__ = "SystemAdministrator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    image_field = Column(String, nullable=True)
