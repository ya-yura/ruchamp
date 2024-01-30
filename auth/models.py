from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata

class Role(Base):
    __tablename__ = "Role"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    permissions = Column(JSON)


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
    confirmation_token = Column(String, nullable=True)


class Athlete(Base):
    __tablename__ = "Athlete"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    weight_category = Column(String, nullable=True)
    belt_rank = Column(String, nullable=True)
    coach_name = Column(String, nullable=True)
    birthdate = Column(TIMESTAMP, nullable=True)
    height = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)


class EventOrganizer(Base):
    __tablename__ = "EventOrganizer"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    organization_name = Column(String, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    description = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)


class Spectator(Base):
    __tablename__ = "Spectator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    full_name = Column(String, nullable=True)
    birthdate = Column(TIMESTAMP, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)


class SystemAdministrator(Base):
    __tablename__ = "SystemAdministrator"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    full_name = Column(String, nullable=True)
    birthdate = Column(TIMESTAMP, nullable=True)
    gender = Column(String, nullable=True)
    country = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)


class Team(Base):
    __tablename__ = "Team"
    id = Column(Integer, primary_key=True)
    captain = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    name = Column(String, nullable=True)
    invite_link = Column(String, nullable=True)
    description = Column(String, nullable=True)
    slug = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)


class TeamMember(Base):
    __tablename__ = "TeamMember"
    id = Column(Integer, primary_key=True)
    team = Column(Integer, ForeignKey("Team.id", ondelete="CASCADE"))
    member = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
