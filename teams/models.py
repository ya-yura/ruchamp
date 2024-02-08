from datetime import datetime
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata


class Team(Base):
    __tablename__ = "Team"
    id = Column(Integer, primary_key=True)
    captain = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
    name = Column(String, nullable=True)
    invite_link = Column(String, nullable=True)
    description = Column(String, nullable=True)
    slug = Column(String, nullable=True)
    image_field = Column(String, nullable=True)


class TeamMember(Base):
    __tablename__ = "TeamMember"
    id = Column(Integer, primary_key=True)
    team = Column(Integer, ForeignKey("Team.id", ondelete="CASCADE"))
    member = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"))
