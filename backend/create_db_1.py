# Это скрипт создания таблиц в базе. Так как алембик не умеет соблюдать порядок таблиц. 
# А нам нужно, чтобы они создавались в определённом порядке.

from sqlalchemy import create_engine

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
from auth.models import (Base, Role, User, Referee, RefereeType, Coach, CoachType,
                         CategoryType, Athlete, EventOrganizer, Spectator, 
                         SystemAdministrator, CombatType, SportType, AllWeightClass,
                         athlete_grade_association, athlete_sport_type_association,
                         athlete_coach_association)


engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)