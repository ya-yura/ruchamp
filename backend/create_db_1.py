from auth.models import (AllWeightClass, Athlete, Base, CategoryType, Coach,
                         CoachType, CombatType, EventOrganizer, Referee,
                         RefereeType, Role, Spectator, SportType,
                         SystemAdministrator, User, athlete_coach_association,
                         athlete_grade_association,
                         athlete_sport_type_association)
from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from sqlalchemy import create_engine

engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)
