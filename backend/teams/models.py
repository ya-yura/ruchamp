from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
# from sqlalchemy.orm import relationship

from auth.models import Athlete, Region, Country

Base: DeclarativeMeta = declarative_base()

metadata = Base.metadata


class Team(Base):
    __tablename__ = "Team"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    captain = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
    invite_link = Column(String, nullable=True)
    description = Column(String, nullable=True)
    slug = Column(String, nullable=True)
    image_field = Column(String, nullable=True)
    country = Column(Integer, ForeignKey(Country.id, ondelete="CASCADE"))
    city = Column(String, nullable=True)
    region = Column(Integer, ForeignKey(Region.id, ondelete="CASCADE"))


class TeamMember(Base):
    __tablename__ = "TeamMember"
    id = Column(Integer, primary_key=True)
    team = Column(Integer, ForeignKey(Team.id, ondelete="CASCADE"))
    member = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
