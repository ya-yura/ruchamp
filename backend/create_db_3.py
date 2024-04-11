from sqlalchemy import create_engine

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS

from event.models import (Base, Event, EventSports, EventWeights, Participant, Match, MatchWinner,
                          MatchReferee, MatchPeriod, MatchCounter, MatchResult, Prize,
                          Medal)


engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)