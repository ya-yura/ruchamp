from sqlalchemy import create_engine

from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from match.models import AgeCategory, Base, TempAthlete, TempDrawParticipants

engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)