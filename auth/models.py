from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, Table
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

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


class Role(Base):
    __tablename__ = "Role"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    permissions = Column(JSON)


class CombatType(Base):
    __tablename__ = "CombatType"
    combat_type_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class WeightClass(Base):
    __tablename__ = "WeightClass"
    weight_class_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    min_weight = Column(String, nullable=False)
    max_weight = Column(String, nullable=False)


class Referee(Base):
    __tablename__ = "Referee"
    referee_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    qualification_level = Column(String, nullable=False)


class Coach(Base):
    __tablename__ = "Coach"
    coach_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    qualification_level = Column(String, nullable=False)


class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    registered_at = Column(TIMESTAMP, default=datetime.utcnow)
    role_id = Column(Integer, ForeignKey(Role.id))
    hashed_password = Column(String(length=1024), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True)


class Athlete(Base):
    __tablename__ = "Athlete"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    weight_category = Column(Integer, ForeignKey(WeightClass.weight_class_id, ondelete="SET NULL"))
    birthdate = Column(TIMESTAMP, nullable=True)
    height = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    image_field = Column(String, nullable=True)

    # combat_types = relationship("CombatType", secondary=athlete_combat_type_association, back_populates="athletes")
    # coaches = relationship("Coach", secondary=athlete_coach_association, back_populates="athletes")


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


class Spectator(Base):
    __tablename__ = "Spectator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    full_name = Column(String, nullable=True)
    birthdate = Column(TIMESTAMP, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    image_field = Column(String, nullable=True)


class SystemAdministrator(Base):
    __tablename__ = "SystemAdministrator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    full_name = Column(String, nullable=True)
    birthdate = Column(TIMESTAMP, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    image_field = Column(String, nullable=True)

