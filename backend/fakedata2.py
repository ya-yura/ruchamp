import datetime
import hashlib
import random

from faker import Faker
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import create_engine, func, select
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.orm import aliased, sessionmaker
from sqlalchemy.types import TypeDecorator

from auth.models import (AllWeightClass, Athlete, CategoryType, Coach,
                         CoachType, CombatType, EventOrganizer, Referee,
                         RefereeType, Role, Spectator, SportType,
                         SystemAdministrator, User, athlete_coach_association,
                         athlete_sport_type_association, Country, Region, Area)
from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from connection import SessionLocal
from event.models import (Event, Match, MatchSport, MatchAge, MatchCategory,
                          MatchGender, MatchParticipant, MatchWeights, Fight, FightWinner,
                          MatchResult, Medal, Prize)
from teams.models import TeamMember, Team

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

user_db = SQLAlchemyUserDatabase(User, SessionLocal())

fake = Faker("ru_RU")


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def create_test_users(session, num_athletes, num_organizers):
    test_users = []

    for i in range(1, num_athletes + 1):
        user_data = {
            'id': f'{i + 1_000_000}',
            'email': f'athlete.{i}@test.com',
            'username': f'athlete.{i}',
            'name': fake.first_name(),
            'sirname': fake.last_name(),
            'fathername': 'Сёмёнович',
            'gender': random.choice([True, False]),
            'birthdate': fake.date_of_birth(minimum_age=16, maximum_age=20),
            'hashed_password': hash_password('1q2w3e4r5'),
            'is_active': True,
            'is_superuser': False,
            'is_verified': True,
            'verification_token': str(fake.uuid4()),
            'role_id': 1  # Спортсмен
        }
        test_users.append(user_data)

    for i in range(1, num_organizers + 1):
        user_data = {
            'id': f'{i + 1_100_000}',
            'email': f'organizer.{i}@test.com',
            'username': f'organizer.{i}',
            'name': fake.first_name(),
            'sirname': fake.last_name(),
            'fathername': 'Сёмёнович',
            'gender': random.choice([True, False]),
            'birthdate': fake.date_of_birth(minimum_age=25, maximum_age=60),
            'hashed_password': hash_password('1q2w3e4r5'),
            'is_active': True,
            'is_superuser': False,
            'is_verified': True,
            'verification_token': str(fake.uuid4()),
            'role_id': 2  # Организатор
        }
        test_users.append(user_data)

    created_users = []
    for user_data in test_users:
        user = User(**user_data)
        session.add(user)
        session.commit()  # Сохраняем пользователя, чтобы получить его ID
        created_users.append(user)

    return created_users


def create_roles_for_users(session, users):
    for user in users:
        if user.role_id == 1:  # Спортсмен
            athlete_data = {
                'user_id': user.id,
                'weight': round(random.uniform(55, 58), 2),
                'height': random.randint(168, 172),
                'image_field': fake.image_url(),
                'country': session.query(Country).order_by(func.random()).first().id,
                'city': fake.city(),
                'region': session.query(Region).order_by(func.random()).first().id,
                'sport_types': [1],
                'coaches': fake.random_elements(
                    elements=session.query(Coach).all(),
                    length=fake.random_int(min=1, max=4),
                    unique=True
                ),
                'grades': [1],
            }
            athlete = Athlete(**athlete_data)
            session.add(athlete)

        elif user.role_id == 2:  # Организатор
            organizer_data = {
                'user_id': user.id,
                'organization_name': fake.company(),
                'website': fake.url(),
                'contact_email': fake.email(),
                'contact_phone': fake.phone_number(),
                'description': fake.text(),
                'image_field': fake.image_url(),
            }
            organizer = EventOrganizer(**organizer_data)
            session.add(organizer)

    session.commit()


def create_events_for_organizers(session, organizers, num_events):
    for i in range(num_events):
        organizer = fake.random_int(min=1_100_000, max=(1_100_000 + num_organizers))
        event_data = {
            'id': f'{i + 1_000_000}',
            'name': f'ТЕСТ ID {i + 1_000_000}',  # Уникальное имя для идентификации
            'start_datetime': datetime.datetime.now(),  # Начало мероприятия сегодня
            'end_datetime': datetime.datetime.now() + datetime.timedelta(days=3),  # Конец мероприятия через 3 дня
            'start_request_datetime': datetime.datetime.now(),  # Начало приема заявок сейчас
            'end_request_datetime': datetime.datetime.now() + datetime.timedelta(days=2),  # Конец приема заявок через 2 дня
            'location': fake.address(),
            'organizer_id': organizer,
            'event_order': fake.text(),
            'event_system': fake.word(),
            'geo': f'{fake.latitude()},{fake.longitude()}',
            'image_field': fake.image_url(),
            'description': f'Это проверочное мероприятие с ID {i + 1_000_000}',
        }
        event = Event(**event_data)
        session.add(event)

    session.commit()


# Создаем весовые категории
weight_categories = []
weight_categories.append(AllWeightClass(id=1_000_001, name="Пёрышко", min_weight="0", max_weight="30"))
weight_categories.append(AllWeightClass(id=1_000_002, name="Гирька", min_weight="30", max_weight="60"))
weight_categories.append(AllWeightClass(id=1_000_003, name="Кит", min_weight="60", max_weight="100"))
# session.add_all(weight_categories)
# session.commit()


# Создаем категории участников
category_types = []
category_types.append(CategoryType(id=1_000_001, name="Категория 1"))
category_types.append(CategoryType(id=1_000_002, name="Категория 2"))
# session.add_all(category_types)
# session.commit()


num_athletes = 16
num_organizers = 2
num_events = 5

created_users = create_test_users(session, num_athletes, num_organizers)

create_roles_for_users(session, created_users)

organizers = [user for user in created_users if user.role_id == 2]
athletes = [user for user in created_users if user.role_id == 1]

create_events_for_organizers(session, organizers, num_events)

# Создаем матч для самбо
event = Event(id=fake.random_int(min=1_000_000, max=(1_000_000 + num_events)))
match = Match(
    name="Самбо",
    event_id=event.id,
    combat_type_id=1,
    start_datetime=event.start_datetime,
    end_datetime=event.end_datetime,
    nominal_time=5,  # Номинальное время матча в минутах
    mat_vol=3  # Три поля (мата)
)
session.add(match)
session.commit()

# Создаем возрастные категории
age_categories = []
age_categories.append(MatchAge(id=1_000_001, match_id=match.id, age_from="10", age_till="15"))
age_categories.append(MatchAge(id=1_000_002, match_id=match.id, age_from="16", age_till="18"))
age_categories.append(MatchAge(id=1_000_003, match_id=match.id, age_from="19", age_till="40"))
session.add_all(age_categories)
session.commit()


# Создаем записи в дополнительных таблицах для категорий участников
for athlete in athletes:
    match_participant = MatchParticipant(
        match_id=match.id,
        player_id=athlete.id,
        team_id=0,  # Нет команды
        nmbr_in_game=random.randint(1, 16)  # Порядковый номер участника
    )
    session.add(match_participant)

session.commit()

# Генерируем бои и результаты для турнира по олимпийской системе
participants = session.query(MatchParticipant).filter_by(match_id=match.id).all()


# Создаем функцию для генерации боевой сетки
def generate_fight_grid(participants):
    num_participants = len(participants)
    fight_round = 1
    while len(participants) > 1:
        next_round_participants = []
        for i in range(0, len(participants), 2):
            player_red = participants[i]
            player_blue = participants[i + 1]

            fight = Fight(
                match_id=match.id,
                start_datetime=event.start_datetime,
                end_datetime=event.end_datetime,
                player_red=player_red.player_id,
                player_blue=player_blue.player_id,
                mat=random.randint(1, 3),
                round=fight_round
            )
            session.add(fight)

            # Определяем победителя случайным образом
            if random.random() > 0.5:
                winner = player_red
                loser = player_blue
            else:
                winner = player_blue
                loser = player_red

            # Создаем запись о победителе
            fight_winner = FightWinner(
                fight_id=fight.id,
                winner_id=winner.player_id,
                winner_score=random.randint(5, 10),
                loser_score=random.randint(0, 5)
            )
            session.add(fight_winner)

            next_round_participants.append(winner)

        session.commit()
        participants = next_round_participants
        fight_round += 1


# Генерим боевую сетку
generate_fight_grid(participants)

session.commit()

session.close()
