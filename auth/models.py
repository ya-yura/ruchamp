from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, ForeignKey, JSON, Boolean, MetaData
from sqlalchemy.orm import relationship
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from database import Base

metadata = MetaData()

role = Table(
    "role",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
    Column("permissions", JSON),
)


class Athlete(Base):
    __tablename__ = 'athletes'

    id = Column(Integer, primary_key=True, index=True)
    permissions = Column(JSON)
    # Дополнительные поля спортсмена


class EventOrganizer(Base):
    __tablename__ = 'event_organizers'

    id = Column(Integer, primary_key=True, index=True)
    permissions = Column(JSON)
    # Дополнительные поля организатора


class SystemAdministrator(Base):
    __tablename__ = 'system_administrators'

    id = Column(Integer, primary_key=True, index=True)
    permissions = Column(JSON)
    # Дополнительные поля админа


class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    registered_at = Column(TIMESTAMP, default=datetime.utcnow)
    hashed_password: str = Column(String(length=1024), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_superuser: bool = Column(Boolean, default=False, nullable=False)
    is_verified: bool = Column(Boolean, default=False, nullable=False)

    athlete_profile = relationship("Athlete", back_populates="user")
    organizer_profile = relationship("EventOrganizer", back_populates="user")
    admin_profile = relationship("SystemAdministrator", back_populates="user")
