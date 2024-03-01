from datetime import datetime
from sqlalchemy import Column, String, Date, Float, Boolean, Integer, TIMESTAMP, ForeignKey, Table, DateTime
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base


Base: DeclarativeMeta = declarative_base()
metadata = Base.metadata


athlete_combat_type_association = Table(
    'athlete_combat_type_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('combat_type_id', Integer, ForeignKey('CombatType.id'))
)

athlete_coach_association = Table(
    'athlete_coach_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('coach_id', Integer, ForeignKey('Coach.id'))
)

athlete_grade_association = Table(
    'athlete_grade_association', Base.metadata,
    Column('athlete_id', Integer, ForeignKey('Athlete.id')),
    Column('grade_id', Integer, ForeignKey('CategoryType.id'))
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
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    athletes = relationship("Athlete", secondary=athlete_combat_type_association, back_populates="combat_types")


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


# Виды спорта, которые фигурируют в системе
class SportType(Base):
    __tablename__ = "SportType"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


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
    qualification_level = Column(Integer, ForeignKey(CoachType.id, ondelete="CASCADE"))

    athletes = relationship("Athlete", secondary=athlete_coach_association, back_populates="coaches")


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
    country = Column(String, nullable=True)
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
    qualification_level = Column(Integer, ForeignKey(RefereeType.id, ondelete="CASCADE"))
    image_field = Column(String, nullable=True)


# спортсмен
class Athlete(Base):
    __tablename__ = "Athlete"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id, ondelete="CASCADE"))
    weight = Column(Float, nullable=True)
    height = Column(Integer, nullable=True)
    image_field = Column(String, nullable=True)

    combat_types = relationship("CombatType", secondary=athlete_combat_type_association, back_populates="athletes")
    coaches = relationship("Coach", secondary=athlete_coach_association, back_populates="athletes")
    grades = relationship("Grade", secondary=athlete_coach_association, back_populates="athletes")


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


# Связка между спортсменом и его возможными спортивными категориями
class SportCategory(Base):
    __tablename__ = "SportCategory"
    id = Column(Integer, primary_key=True)
    athlete = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
    sport_type = Column(Integer, ForeignKey(SportType.id, ondelete="CASCADE"))
    category_type = Column(Integer, ForeignKey(CategoryType.id, ondelete="CASCADE"))


# Связка между спортсменом, и его возможными весовыми категориями
class WeightCategory(Base):
    __tablename__ = "WeightCategory"
    id = Column(Integer, primary_key=True)
    athlete = Column(Integer, ForeignKey(Athlete.id, ondelete="CASCADE"))
    sport_type = Column(Integer, ForeignKey(SportType.id, ondelete="CASCADE"))
    weight_type = Column(Integer, ForeignKey(AllWeightClass.id, ondelete="CASCADE"))

