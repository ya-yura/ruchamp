# Это скрипт создания таблиц в базе. Так как алембик не умеет соблюдать порядок таблиц. 
# А нам нужно, чтобы они создавались в определённом порядке.

from sqlalchemy import create_engine

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS

# Сначала комментим остальные модели, кроме этой и выполняем этот скрипт
from auth.models import (
    Base,
    Role,
    User,
    Referee, 
    Coach, 
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
    CombatType,
    SportType,
    AllWeightClass,
    SportCategory,
    SportCategory,
    WeightCategory,
    athlete_combat_type_association,
    athlete_coach_association,
)

# потом раскомментируем эти модели и снова выполняем - это создаст дополнительные зависимые таблицы
from teams.models import (
    Base,
    Team,
    TeamMember,
)

# и наконец тут так же. Этот блок таблиц создаём в последнюю очередь
from event.models import (
    Base,
    Event, 
    Participant, 
    Match,
    MatchPeriod,
    MatchResult, 
    Prize, 
    Medal,
)


engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)
