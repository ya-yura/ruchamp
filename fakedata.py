import random
from faker import Faker
from connection import SessionLocal

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from fastapi_users.db import SQLAlchemyUserDatabase

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
from auth.models import (
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
    User,
    Role,
    CombatType,
    SportType,
    SportCategory,
    CategoryType, 
    AllWeightClass,
    WeightCategory,
    Referee, 
    Coach, 
    athlete_combat_type_association,
    athlete_coach_association,
)
from event.models import (
    Event,
    Participant,
    Match,
    MatchResult,
    Prize,
    Medal,
    MatchPeriod,
)
from event.models import (
    Team,
    TeamMember,
)

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

user_db = SQLAlchemyUserDatabase(User, SessionLocal())

fake = Faker("ru_RU")

num_users = 1000
num_referees = 10
num_coaches = 5
num_athletes = 100
num_sport_categories = int(num_athletes/2)
num_weight_categories = num_athletes
num_organizers = 10
num_spectators = 20
num_administrators = 5
num_teams = 10
num_team_members = 7
num_medals = 33
num_prizes = 50
num_matches = 10
num_results = 5
num_links = 20


def generate_fake_roles(session):
    roles = ['Спортсмен', 'Организатор', 'Зритель', 'Сисадмин', 'Судья']
    for role_name in roles:
        role = Role(name=role_name)
        session.add(role)
    session.commit()


def generate_fake_combat_types(session):
    combat_types = [
        "Single elimination (Олимпийская система)",
        "Double elimination (Система с двойным выбыванием)",
        "Round robin (Круговая система)",
        "3 players with comeback (Система с возвращением для 3 игроков)",
        "Multistage (Многоэтапная система)",
        "Voting with judges score (Система с голосованием судей)",
        "Placement bracket (Система определения мест)",
        "2 players - best of three (Серия из 3 игр)",
    ]
    for combat_type_name in combat_types:
        combat_type = CombatType(name=combat_type_name)
        session.add(combat_type)
    session.commit()


def generate_fake_category_types(session):
    category_types = [
        'МС', 'КМС', 'ЗМС', 'МСМК',
        '1-й спортивный разряд', '2-й спортивный разряд', '3-й спортивный разряд',
        '1-й юношеский разряд', '2-й юношеский разряд', '3-й юношеский разряд']
    for category_type_name in category_types:
        category_type = CategoryType(name=category_type_name)
        session.add(category_type)
    session.commit()


def generate_fake_sport_types(session):
    sport_types = [
        "Айкидо", "Кайдо", "Каратэномичи", "Кендо", "Кикбоксинг",
        "Киокусинкай", "Кобудо", "Комбат самооборона", "Комплексное единоборство",
        "Каратэ", "Кудо", "Ориентал", "Панкратион", "Практическая стрельба",
        "Рукопашный бой", "Русское боевое искусство", "Самбо", "Современный мечевой бой",
        "Спортивное метание ножа", "Спортивный ножевой бой", "Сумо", "Тайский бокс",
        "Тхэквондо", "Ушу", "Бокс", "Греко-римская борьба", "Вольная борьба",
        "Самбо", "Дзюдо", "Джиу-джитсу"
    ]
    for sport_type_name in sport_types:
        sport_type = SportType(name=sport_type_name)
        session.add(sport_type)
    session.commit()


def generate_fake_weight_classes(session):
    weight_classes = [
        {'name': 'Сверхтяжёлый', 'min_weight': '100 kg', 'max_weight': '150 kg'},
        {'name': 'Тяжёлый', 'min_weight': '90 kg', 'max_weight': '100 kg'},
        {'name': 'Средний', 'min_weight': '75 kg', 'max_weight': '90 kg'},
        {'name': 'Лёгкий', 'min_weight': '60 kg', 'max_weight': '75 kg'},
        {'name': 'Легчайший', 'min_weight': '45 kg', 'max_weight': '60 kg'},
    ]
    for weight_class_data in weight_classes:
        weight_class = AllWeightClass(**weight_class_data)
        session.add(weight_class)
    session.commit()


def generate_fake_coaches(session, num_coaches=num_coaches):
    coaches_data = []
    for _ in range(num_coaches):
        coach_data = {
            'name': fake.first_name(),
            'sirname': fake.last_name(),
            'fathername': fake.first_name_male() if fake.boolean(chance_of_getting_true=50) else fake.first_name_female(),
            'gender': fake.boolean(),
            'country': fake.country(),
            'birthdate': fake.date_of_birth(minimum_age=30, maximum_age=60),
            'qualification_level': fake.random_element(elements=('Beginner', 'Intermediate', 'Advanced', 'Master')),
        }
        coaches_data.append(coach_data)

    for coach_data in coaches_data:
        coach = Coach(**coach_data)
        session.add(coach)
    session.commit()


def generate_fake_users(session, num_users=num_users):
    users_data = []
    for _ in range(num_users):
        user_data = {
            'email': fake.email(),
            'username': fake.user_name(),
            'registered_at': fake.date_time_this_decade(),
            'role_id': fake.random_int(min=1, max=5),

            'name': fake.first_name(),
            'sirname': fake.last_name(),
            'fathername': fake.first_name_male() if fake.boolean(chance_of_getting_true=50) else fake.first_name_female(),
            'gender': fake.boolean(),
            'country': fake.country(),
            'birthdate': fake.date_of_birth(minimum_age=18, maximum_age=80),

            'hashed_password': fake.password(length=12),
            'is_active': fake.boolean(),
            'is_superuser': fake.boolean(),
            'is_verified': fake.boolean(),
            'verification_token': fake.uuid4() if fake.boolean(chance_of_getting_true=20) else None,
        }
        users_data.append(user_data)

    for user_data in users_data:
        user = User(**user_data)
        session.add(user)
    session.commit()


# Генерация данных для судей
def generate_fake_referees(session, num_referees=num_referees):
    referees_data = []
    users = session.query(User).all()

    referee_users = [user for user in users if user.role_id == 5]

    if len(referee_users) < num_referees:
        additional_users = random.sample(users, num_referees - len(referee_users))
        referee_users.extend(additional_users)

    for user in referee_users:
        referee_data = {
            'user_id': user.id,
            'qualification_level': fake.random_element(elements=[
                'Юный спортивный судья',
                'Спортивный судья третьей категории',
                'Спортивный судья второй категории',
                'Спортивный судья первой категории',
                'Спортивный судья всероссийской категории'
                ]),
        }
        referees_data.append(referee_data)

    for referee_data in referees_data:
        referee = Referee(**referee_data)
        session.add(referee)
    session.commit()


# Генерация данных для спортсменов
def generate_fake_athletes(session, num_athletes=num_athletes):
    athletes_data = []
    users = session.query(User).all()

    athlete_users = [user for user in users if user.role_id == 1]

    if len(athlete_users) < num_athletes:
        additional_users = random.sample(users, num_athletes - len(athlete_users))
        athlete_users.extend(additional_users)

    for user in athlete_users:
        athlete_data = {
            'user_id': user.id,
            'weight': fake.random_int(min=30, max=180),
            'height': fake.random_int(min=120, max=200),
            'image_field': fake.image_url() if fake.boolean(chance_of_getting_true=20) else None,
        }
        athletes_data.append(athlete_data)

    existing_users = session.execute(select(User)).scalars().all()
    user_ids = [user.id for user in existing_users]

    # Проверка существования пользователя для каждого атлета
    for athlete_data in athletes_data:
        if athlete_data['user_id'] not in user_ids:
            # Если пользователь не существует, сгенерировать случайный ID из существующих
            athlete_data['user_id'] = fake.random_element(elements=user_ids)

    for athlete_data in athletes_data:
        athlete = Athlete(**athlete_data)
        session.add(athlete)
    session.commit()


# Генерация данных для спортивных категорий спортсменов
def generate_fake_sport_categories(session, num_sport_categories=num_sport_categories):
    sport_categories_data = []
    athletes = session.query(Athlete).all()
    sport_types = session.query(SportType).all()
    category_types = session.query(CategoryType).all()

    athlete_ids = [athlete.id for athlete in athletes]
    sport_type_ids = [sport_type.id for sport_type in sport_types]
    category_type_ids = [category_type.id for category_type in category_types]

    for _ in range(num_sport_categories):
        sport_category_data = {
            'id': fake.random_int(min=1), 
            'name': fake.word(), 
            'athlete': fake.random_element(elements=athlete_ids),
            'sport_type': fake.random_element(elements=sport_type_ids),
            'category_type': fake.random_element(elements=category_type_ids),
        }
        sport_categories_data.append(sport_category_data)

    for sport_category_data in sport_categories_data:
        sport_category = SportCategory(**sport_category_data)
        session.add(sport_category)
    session.commit()


# Генерация данных для весовых категорий спортсменов
def generate_fake_weight_categories(session, num_weight_categories=num_weight_categories):
    weight_categories_data = []
    athletes = session.query(Athlete).all()
    sport_types = session.query(SportType).all()
    weight_classes = session.query(AllWeightClass).all()

    athlete_ids = [athlete.id for athlete in athletes]
    sport_type_ids = [sport_type.id for sport_type in sport_types]
    weight_class_ids = [weight_class.id for weight_class in weight_classes]

    for _ in range(num_weight_categories):
        weight_category_data = {
            'name': fake.word(), 
            'athlete': fake.random_element(elements=athlete_ids),
            'sport_type': fake.random_element(elements=sport_type_ids),
            'weight_type': fake.random_element(elements=weight_class_ids),
        }
        weight_categories_data.append(weight_category_data)

    for weight_category_data in weight_categories_data:
        weight_category = WeightCategory(**weight_category_data)
        session.add(weight_category)
    session.commit()


# Генерация данных для организаторов
def generate_fake_event_organizers(session, num_organizers=num_organizers):
    organizers_data = []
    users = session.query(User).all()

    organizer_users = [user for user in users if user.role_id == 2]

    if len(organizer_users) < num_organizers:
        additional_users = random.sample(users, num_organizers - len(organizer_users))
        organizer_users.extend(additional_users)

    for user in organizer_users:
        organizer_data = {
            'user_id': user.id,
            'organization_name': fake.company(),
            'website': fake.url(),
            'contact_email': fake.email(),
            'contact_phone': fake.phone_number(),
            'description': fake.text(),
            'image_field': fake.image_url(),
        }
        organizers_data.append(organizer_data)

    for organizer_data in organizers_data:
        organizer = EventOrganizer(**organizer_data)
        session.add(organizer)
    session.commit()


# Генерация данных для зрителей
def generate_fake_spectators(session, num_spectators=num_spectators):
    spectators_data = []
    users = session.query(User).all()

    spectator_users = [user for user in users if user.role_id == 3]

    if len(spectator_users) < num_spectators:
        additional_users = random.sample(users, num_spectators - len(spectator_users))
        spectator_users.extend(additional_users)

    for user in spectator_users:
        spectator_data = {
            'user_id': user.id,
            'phone_number': fake.phone_number(),
            'image_field': fake.image_url(),
        }
        spectators_data.append(spectator_data)

    for spectator_data in spectators_data:
        spectator = Spectator(**spectator_data)
        session.add(spectator)
    session.commit()


# Генерация данных для системных администраторов
def generate_fake_system_administrators(session, num_administrators=num_administrators):
    administrators_data = []
    users = session.query(User).all()

    admin_users = [user for user in users if user.role_id == 4]

    if len(admin_users) < num_administrators:
        additional_users = random.sample(users, num_administrators - len(admin_users))
        admin_users.extend(additional_users)

    for user in admin_users:
        administrator_data = {
            'user_id': user.id,
            'image_field': fake.image_url(),
        }
        administrators_data.append(administrator_data)

    for administrator_data in administrators_data:
        administrator = SystemAdministrator(**administrator_data)
        session.add(administrator)
    session.commit()


# Генерация данных для команд
def generate_fake_teams(session, num_teams=num_teams):
    teams_data = []
    athletes = session.query(Athlete).all()

    athlete_ids = [athlete.id for athlete in athletes]

    for _ in range(num_teams):
        team_data = {
            'captain': fake.random_element(elements=athlete_ids),
            'name': fake.company(),
            'invite_link': fake.uuid4(),
            'description': fake.sentence(),
            'slug': fake.slug(),
            'image_field': fake.image_url(),
        }
        teams_data.append(team_data)

    for team_data in teams_data:
        team = Team(**team_data)
        session.add(team)
    session.commit()


# Генерация данных для участников спортивных событий
def generate_fake_participants(session, num_participants=20):
    participants_data = []
    events = session.query(Event).all()
    player_id = session.query(TeamMember).all()

    event_ids = [event.id for event in events]
    player_ids = [member.id for member in player_id]

    for _ in range(num_participants):
        participant_data = {
            'event_id': fake.random_element(elements=event_ids),
            'player_id': fake.random_element(elements=player_ids),
        }
        participants_data.append(participant_data)

    for participant_data in participants_data:
        participant = Participant(**participant_data)
        session.add(participant)
    session.commit()



# Генерация данных для спортивных событий
def generate_fake_events(session, num_events=10):
    events_data = []
    users = session.query(User).all()

    # Filter users with role_id == 2 (assuming it represents organizers)
    organizers = [user for user in users if user.role_id == 2]

    if len(organizers) < num_events:
        additional_users = random.sample(users, num_events - len(organizers))
        organizers.extend(additional_users)

    for organizer in organizers:
        # Check if the organizer has an entry in EventOrganizer
        event_organizer = session.query(EventOrganizer).filter_by(id=organizer.id).first()

        if event_organizer:
            event_data = {
                'name': fake.sentence(),
                'start_datetime': fake.future_datetime(),
                'end_datetime': fake.future_datetime(),
                'location': fake.address(),
                'organizer_id': organizer.id,
                'event_order': fake.text(),
                'event_system': fake.word(),
                'geo': str(fake.latitude()) + ',' + str(fake.longitude()),
            }
            events_data.append(event_data)

    for event_data in events_data:
        event = Event(**event_data)
        session.add(event)
    session.commit()


# Генерация данных для участников спортивных событий
def generate_fake_team_member(session, num_participants=20):
    participants_data = []
    athletes = session.query(Athlete).all()
    teams = session.query(Team).all()

    athlete_ids = [athlete.id for athlete in athletes]
    team_ids = [team.id for team in teams]

    for _ in range(num_participants):
        participant_data = {
            'team': fake.random_element(elements=team_ids),
            'member': fake.random_element(elements=athlete_ids),
        }
        participants_data.append(participant_data)

    for participant_data in participants_data:
        participant = TeamMember(**participant_data)
        session.add(participant)
    session.commit()



# Генерация данных для матчей
def generate_fake_matches(session, num_matches=num_matches):
    matches_data = []
    events = session.query(Event).all()
    participants = session.query(Participant).all()
    teams = session.query(Team).all()
    weight_classes = session.query(AllWeightClass).all()
    sport_types = session.query(SportType).all()
    category_types = session.query(CategoryType).all()

    event_ids = [event.id for event in events]
    participant_team_ids = [participant.team_id for participant in participants]
    unique_team_ids = list(set(participant_team_ids))
    sport_type_ids = [sport_type.id for sport_type in sport_types]
    weight_class_ids = [weight_class.id for weight_class in weight_classes]
    category_type_ids = [category_type.id for category_type in category_types]

    # Убеждаемся, что существует достаточно команд для проведения матчей
    if len(unique_team_ids) < 2 * num_matches:
        raise ValueError("Не хватает команд.")

    for _ in range(num_matches):
        match_data = {
            'event_id': fake.random_element(elements=event_ids),
            'round': fake.random_int(min=1, max=5),
            'sport_type_id': fake.random_element(elements=sport_type_ids),
            'category_id': fake.random_element(elements=category_type_ids),
            'weight_class_id': fake.random_element(elements=weight_class_ids),
            'start_datetime': fake.date_time_between(start_date="-30d", end_date="+30d"),
            'end_datetime': fake.date_time_between(start_date="+1h", end_date="+4h"),
            'player_one': fake.random_element(elements=unique_team_ids),
            'player_two': fake.random_element(elements=[team_id for team_id in unique_team_ids if team_id != match_data['player_one']]),
            # Выбираем победителя случайным образом из команд, участвующих в матче
            'winner_id': fake.random_element(elements=[match_data['player_one'], match_data['player_two']]),
        }
        matches_data.append(match_data)

    for match_data in matches_data:
        match = Match(**match_data)
        session.add(match)
    session.commit()


# Генерация данных для периодов матчей
def generate_fake_match_periods(session, num_periods=5):
    match_periods_data = []
    for _ in range(num_periods):
        match_period_data = {
            'match_id': fake.random_int(min=1, max=num_matches),  
            'start_datetime': fake.date_time_between(start_date="-1h", end_date="+1h"), 
            'end_datetime': fake.date_time_between(start_date="+1min", end_date="+30min"),  
            'winner_score': fake.random_int(min=5, max=10),
            'loser_score': fake.random_int(min=1, max=5),  
        }
        match_periods_data.append(match_period_data)

    for match_period_data in match_periods_data:
        match_period = MatchPeriod(**match_period_data)
        session.add(match_period)
    session.commit()



# Генерация данных для результатов матчей
def generate_fake_match_results(session, num_results=num_results):
    match_results_data = []
    for _ in range(num_results):
        match_result_data = {
            'match_id': fake.random_int(min=1, max=num_matches),
            'winner_score': fake.random_int(min=5, max=10),
            'loser_score': fake.random_int(min=1, max=5),
        }
        match_results_data.append(match_result_data)

    for match_result_data in match_results_data:
        match_result = MatchResult(**match_result_data)
        session.add(match_result)
    session.commit()


# Генерация данных для призов
def generate_fake_prizes(session, num_prizes=num_prizes):
    prizes_data = []
    events = session.query(Event).all()
    participants = session.query(Participant).all()

    event_ids = [event.id for event in events]
    participant_team_ids = [participant.team_id for participant in participants]
    unique_team_ids = list(set(participant_team_ids))

    for _ in range(num_prizes):
        prize_data = {
            'event_id': fake.random_element(elements=event_ids),
            'recipient_id': fake.random_element(elements=unique_team_ids),
            'amount': fake.random_int(min=100, max=10000),
            'description': fake.sentence(),
        }
        prizes_data.append(prize_data)

    for prize_data in prizes_data:
        prize = Prize(**prize_data)
        session.add(prize)
    session.commit()


# Генерация данных для медалей
def generate_fake_medals(session, num_medals=num_medals):
    medals_data = []
    events = session.query(Event).all()
    participants = session.query(Participant).all()

    event_ids = [event.id for event in events]
    participant_team_ids = [participant.team_id for participant in participants]
    unique_team_ids = list(set(participant_team_ids))

    for _ in range(num_medals):
        medal_data = {
            'event_id': fake.random_element(elements=event_ids),
            'recipient_id': fake.random_element(elements=unique_team_ids),
            'medal_type': fake.random_element(elements=('Золото', 'Серебро', 'Бронза')),
        }
        medals_data.append(medal_data)

    for medal_data in medals_data:
        medal = Medal(**medal_data)
        session.add(medal)
    session.commit()


# Генерация данных для медалей
def generate_fake_links(session, num_links=num_links):
    athletes = session.query(Athlete).all()
    combat_types = session.query(Athlete).all()
    coaches = session.query(Athlete).all()
    athlete_ids = [athlete.id for athlete in athletes]
    combat_type_ids = [combat_type.id for combat_type in combat_types]
    coach_ids = [coach.id for coach in coaches]

    for _ in range(num_links): 
        athlete_id = fake.random_element(elements=athlete_ids)
        combat_type_id = fake.random_element(elements=combat_type_ids)

        session.execute(athlete_combat_type_association.insert().values(
            athlete_id=athlete_id,
            combat_type_id=combat_type_id
        ))


    for _ in range(num_links):
        athlete_id = fake.random_element(elements=athlete_ids)
        coach_id = fake.random_element(elements=coach_ids)

        session.execute(athlete_coach_association.insert().values(
            athlete_id=athlete_id,
            coach_id=coach_id
        ))

    # Завершите сессию
    session.commit()


# generate_fake_roles(session)

# generate_fake_combat_types(session)
# generate_fake_category_types(session)
# generate_fake_sport_types(session)
# generate_fake_weight_classes(session)

# generate_fake_users(session, num_users)
# generate_fake_coaches(session)
# generate_fake_referees(session)
# generate_fake_athletes(session)
# generate_fake_event_organizers(session)
# generate_fake_spectators(session)
# generate_fake_system_administrators(session)

# generate_fake_sport_categories(session)
# generate_fake_weight_categories(session)

# generate_fake_teams(session)
# generate_fake_team_member(session)

# generate_fake_events(session)
# generate_fake_participants(session)
generate_fake_matches(session)
generate_fake_match_results(session)
generate_fake_match_periods(session)

# generate_fake_prizes(session)
# generate_fake_medals(session)
# generate_fake_links(session)

