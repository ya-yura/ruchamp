import datetime
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
                          MatchGender, MatchParticipant, MatchWeights,
                          MatchResult, Medal, Prize, Team)
from teams.models import TeamMember

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

user_db = SQLAlchemyUserDatabase(User, SessionLocal())

fake = Faker("ru_RU")

num_users = 1_000

num_referees = int(num_users * 0.05)
num_coaches = int(num_users * 0.03)
num_athletes = int(num_users * 0.7)
num_organizers = int(num_users * 0.02)
num_spectators = int(num_users * 0.2)
num_administrators = int(num_users * 0.01)

num_teams = int(num_athletes * 0.5)
num_team_members = 20
team_size = 200

num_events = int(num_teams * 3)
num_participants = int(num_athletes * num_events / 10)
num_matches = int(num_events * 3)
num_results = int(num_events * num_matches)
num_links = 20

num_medals = 33
num_prizes = 50
num_sport_categories = int(num_athletes/2)
num_weight_categories = num_athletes


# Заполнение таблицы стран
countries_data = [
    {"name": "Россия"},
    {"name": "Беларусь"},
    {"name": "Казахстан"}
]

regions_data = {
    "Россия": [
        {"name": "Центральный федеральный округ"},
        {"name": "Северо-Западный федеральный округ"},
        {"name": "Южный федеральный округ"},
        {"name": "Приволжский федеральный округ"},
        {"name": "Уральский федеральный округ"},
        {"name": "Сибирский федеральный округ"},
        {"name": "Дальневосточный федеральный округ"}
    ],
    "Беларусь": [
        {"name": "Брестская область"},
        {"name": "Витебская область"},
        {"name": "Гомельская область"},
        {"name": "Гродненская область"},
        {"name": "Минская область"},
        {"name": "Могилевская область"}
    ],
    "Казахстан": [
        {"name": "Акмолинская область"},
        {"name": "Актюбинская область"},
        {"name": "Алматинская область"},
        {"name": "Атырауская область"},
        {"name": "Восточно-Казахстанская область"},
        {"name": "Жамбылская область"},
        {"name": "Западно-Казахстанская область"},
        {"name": "Карагандинская область"},
        {"name": "Костанайская область"},
        {"name": "Кызылординская область"},
        {"name": "Мангистауская область"},
        {"name": "Павлодарская область"},
        {"name": "Северо-Казахстанская область"},
        {"name": "Туркестанская область"}
    ]
}

areas_data = {
    "Центральный федеральный округ": [
        {"name": "Московская область"},
        {"name": "Владимирская область"},
        {"name": "Тверская область"},
        {"name": "Калужская область"},
        {"name": "Ярославская область"},
        {"name": "Рязанская область"},
        {"name": "Ивановская область"},
        {"name": "Костромская область"},
        {"name": "Смоленская область"},
        {"name": "Тульская область"},
        {"name": "Белгородская область"},
        {"name": "Липецкая область"},
        {"name": "Орловская область"},
        {"name": "Тамбовская область"},
        {"name": "Курская область"}
    ],
    "Северо-Западный федеральный округ": [
        {"name": "Санкт-Петербург"},
        {"name": "Ленинградская область"},
        {"name": "Псковская область"},
        {"name": "Новгородская область"},
        {"name": "Мурманская область"},
        {"name": "Архангельская область"},
        {"name": "Вологодская область"},
        {"name": "Калининградская область"},
        {"name": "Республика Карелия"},
        {"name": "Республика Коми"}
    ],
    "Южный федеральный округ": [
        {"name": "Краснодарский край"},
        {"name": "Ростовская область"},
        {"name": "Ставропольский край"},
        {"name": "Республика Адыгея"},
        {"name": "Республика Калмыкия"},
        {"name": "Астраханская область"},
        {"name": "Волгоградская область"}
    ],
    "Приволжский федеральный округ": [
        {"name": "Республика Татарстан"},
        {"name": "Чувашская Республика"},
        {"name": "Республика Марий Эл"},
        {"name": "Удмуртская Республика"},
        {"name": "Самарская область"},
        {"name": "Саратовская область"},
        {"name": "Пензенская область"},
        {"name": "Ульяновская область"},
        {"name": "Пермский край"},
        {"name": "Кировская область"},
        {"name": "Оренбургская область"}
    ],
    "Уральский федеральный округ": [
        {"name": "Свердловская область"},
        {"name": "Челябинская область"},
        {"name": "Республика Башкортостан"},
        {"name": "Пермский край"},
        {"name": "Республика Коми"},
        {"name": "Курганская область"},
        {"name": "Тюменская область"},
        {"name": "Ханты-Мансийский автономный округ — Югра"},
        {"name": "Ямало-Ненецкий автономный округ"}
    ],
    "Сибирский федеральный округ": [
        {"name": "Новосибирская область"},
        {"name": "Омская область"},
        {"name": "Томская область"},
        {"name": "Кемеровская область"},
        {"name": "Республика Алтай"},
        {"name": "Республика Тыва"},
        {"name": "Республика Хакасия"},
        {"name": "Алтайский край"},
        {"name": "Забайкальский край"},
        {"name": "Иркутская область"},
        {"name": "Красноярский край"}
    ],
    "Дальневосточный федеральный округ": [
        {"name": "Приморский край"},
        {"name": "Хабаровский край"},
        {"name": "Амурская область"},
        {"name": "Республика Саха (Якутия)"},
        {"name": "Еврейская автономная область"},
        {"name": "Чукотский автономный округ"},
        {"name": "Сахалинская область"},
        {"name": "Камчатский край"}
    ],
    "Брестская область": [
        {"name": "Брест"},
        {"name": "Барановичи"},
        {"name": "Пинск"},
        {"name": "Кобрин"},
        {"name": "Лунинец"}
    ],
    "Витебская область": [
        {"name": "Витебск"},
        {"name": "Орша"},
        {"name": "Полоцк"},
        {"name": "Новополоцк"},
        {"name": "Глубокое"}
    ],
    "Гомельская область": [
        {"name": "Гомель"},
        {"name": "Мозырь"},
        {"name": "Жлобин"},
        {"name": "Речица"},
        {"name": "Светлогорск"}
    ],
    "Гродненская область": [
        {"name": "Гродно"},
        {"name": "Лида"},
        {"name": "Волковыск"},
        {"name": "Слоним"},
        {"name": "Ивье"}
    ],
    "Минская область": [
        {"name": "Минск"},
        {"name": "Борисов"},
        {"name": "Молодечно"},
        {"name": "Слуцк"},
        {"name": "Мядель"}
    ],
    "Могилевская область": [
        {"name": "Могилев"},
        {"name": "Бобруйск"},
        {"name": "Горки"},
        {"name": "Осиповичи"},
        {"name": "Славгород"}
    ],
    "Акмолинская область": [
        {"name": "Кокшетау"},
        {"name": "Темиртау"},
        {"name": "Щучинск"},
        {"name": "Аксу"},
        {"name": "Макинск"}
    ],
    "Актюбинская область": [
        {"name": "Актобе"},
        {"name": "Хромтау"},
        {"name": "Кандыагаш"},
        {"name": "Шалкар"},
        {"name": "Темир"}
    ],
    "Алматинская область": [
        {"name": "Алматы"},
        {"name": "Талдыкорган"},
        {"name": "Капшагай"},
        {"name": "Текели"},
        {"name": "Ушарал"}
    ],
    "Атырауская область": [
        {"name": "Атырау"},
        {"name": "Кульсары"},
        {"name": "Махамбет"},
        {"name": "Доссор"}
    ],
    "Восточно-Казахстанская область": [
        {"name": "Усть-Каменогорск"},
        {"name": "Семей"},
        {"name": "Аягоз"},
        {"name": "Курчатов"},
        {"name": "Жаркент"}
    ],
    "Жамбылская область": [
        {"name": "Тараз"},
        {"name": "Жамбыл"},
        {"name": "Мерке"},
        {"name": "Каратау"}
    ],
    "Западно-Казахстанская область": [
        {"name": "Уральск"},
        {"name": "Актобе"},
        {"name": "Аральск"},
        {"name": "Казталовка"}
    ],
    "Карагандинская область": [
        {"name": "Караганда"},
        {"name": "Темиртау"},
        {"name": "Сарань"},
        {"name": "Абай"},
        {"name": "Актас"}
    ],
    "Костанайская область": [
        {"name": "Костанай"},
        {"name": "Рудный"},
        {"name": "Аркалык"},
        {"name": "Житикара"},
        {"name": "Лисаковск"}
    ],
    "Кызылординская область": [
        {"name": "Кызылорда"},
        {"name": "Байконур"},
        {"name": "Жалагаш"},
        {"name": "Аральское море"}
    ],
    "Мангистауская область": [
        {"name": "Актау"},
        {"name": "Шетпе"},
        {"name": "Форт-Шевченко"},
        {"name": "Жанаозен"},
        {"name": "Темиртау"}
    ],
    "Павлодарская область": [
        {"name": "Павлодар"},
        {"name": "Экибастуз"},
        {"name": "Качирск"},
        {"name": "Лебяжье"},
        {"name": "Майкудук"}
    ],
    "Северо-Казахстанская область": [
        {"name": "Петропавловск"},
        {"name": "Клинцы"},
        {"name": "Уркараган"},
        {"name": "Жетысай"}
    ],
    "Туркестанская область": [
        {"name": "Шымкент"},
        {"name": "Туркестан"},
        {"name": "Жангелды"},
        {"name": "Мактаарал"}
    ]
}


# Заполнение таблицы стран
def generate_fake_countries(session):
    for country_data in countries_data:
        country = Country(**country_data)
        session.add(country)
        for region_data in regions_data[country.name]:
            region = Region(**region_data)
            region.country = country  # Связь с родительской страной
            session.add(region)
            for area_data in areas_data[region_data["name"]]:
                area = Area(**area_data)
                area.region = region  # Связь с родительским регионом
                session.add(area)

    session.commit()


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


def generate_fake_coach_types(session):
    coach_types = [
        "тренер",
        "начинающий тренер",
        "детский тренер",
        "крутой тренер",
    ]
    for coach_type_name in coach_types:
        coach_type = CoachType(name=coach_type_name)
        session.add(coach_type)
    session.commit()


def generate_fake_referee_types(session):
    referee_types = [
        "Мировой судья",
        "Районный судья",
        "Федеральный судья",
        "Арбитражный судья",
        "Конституционный судья",
    ]
    for referee_type_name in referee_types:
        referee_type = RefereeType(name=referee_type_name)
        session.add(referee_type)
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
        {'name': 'Сверхтяжёлый', 'min_weight': 100, 'max_weight': 150},
        {'name': 'Тяжёлый', 'min_weight': 90, 'max_weight': 100},
        {'name': 'Средний', 'min_weight': 75, 'max_weight': 90},
        {'name': 'Лёгкий', 'min_weight': 60, 'max_weight': 75},
        {'name': 'Легчайший', 'min_weight': 45, 'max_weight': 60},
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
            'country': fake.random_element(elements=[random_country.name for random_country in session.query(Country).all()]),
            'birthdate': fake.date_of_birth(minimum_age=30, maximum_age=60),
            'qualification_level': fake.random_element(elements=[coach_type.id for coach_type in session.query(CoachType).all()]),
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
            'gender': fake.boolean(chance_of_getting_true=75),
            'country': fake.random_element(elements=[random_country.name for random_country in session.query(Country).all()]),
            'birthdate': fake.date_of_birth(minimum_age=12, maximum_age=80),

            'hashed_password': fake.password(length=12),
            'is_active': fake.boolean(),
            'is_superuser': fake.boolean(),
            'is_verified': fake.boolean(),
            'verification_token': str(fake.uuid4()),
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
            'qualification_level': fake.random_element(elements=[coach_type.id for coach_type in session.query(RefereeType).all()]),
            'image_field': fake.image_url() if fake.boolean(chance_of_getting_true=80) else None,
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
            'image_field': fake.image_url() if fake.boolean(chance_of_getting_true=80) else None,
            'country': fake.random_element(elements=[random_country.id for random_country in session.query(Country).all()]),
            'region': fake.random_element(elements=[random_region.id for random_region in session.query(Region).all()]),
            'city': fake.city(),
            'sport_types': fake.random_elements(
                elements=session.query(SportType).all(),
                length=fake.random_int(min=1, max=4),
                unique=True
            ),
            'coaches': fake.random_elements(
                elements=session.query(Coach).all(),
                length=fake.random_int(min=1, max=4),
                unique=True
            ),
            'grades': fake.random_elements(
                elements=session.query(CategoryType).all(),
                length=fake.random_int(min=1, max=3),
                unique=True
            ),
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
def generate_fake_teams_0(session):
    team_data = {
            'id': 0,
            'name': "Нет команды",
    }

    # Создаем команду
    team = Team(**team_data)
    session.add(team)
    session.commit()


def generate_fake_teams(session, num_teams=num_teams):
    athletes = session.query(Athlete).all()

    for _ in range(num_teams):

        team_data = {
            'name': fake.company(),
            'invite_link': str(fake.uuid4()),
            'description': fake.sentence(),
            'slug': fake.slug(),
            'image_field': fake.image_url(),
            'country': fake.random_element(elements=[random_country.id for random_country in session.query(Country).all()]),
            'city': fake.city(),
            'region': fake.random_element(elements=[random_region.id for random_region in session.query(Region).all()]),
        }

        captain = fake.random_element(elements=athletes)

        # Создаем команду
        team = Team(**team_data)
        team.captain = captain.id
        session.add(team)
        session.commit()

        # Добавим капитана в таблицу TeamMember как члена команды
        team_member = TeamMember(team=team.id, member=captain.id)
        session.add(team_member)
        session.commit()


# Генерация данных для участников команд
def generate_fake_team_member(session, num_participants=team_size):
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


# Генерация данных спортивных событий
def generate_fake_events(session, num_events=num_events):
    events_data = []
    organizers = session.query(EventOrganizer).all()

    if not organizers:
        print("Нет зарегистрированных организаторов (EventOrganizer).")
        return

    for _ in range(num_events):
        organizer = random.choice(organizers)
        event_data = {
            'name': fake.sentence(),
            'start_request_datetime': datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(1, 30)),
            'end_request_datetime': datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(31, 60)),
            'start_datetime': datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(61, 90)),
            'end_datetime': datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(91, 120)),
            'location': fake.address(),
            'organizer_id': organizer.id,
            'event_order': fake.text(),
            'event_system': fake.word(),
            'geo': str(fake.latitude()) + ',' + str(fake.longitude()),
            'image_field': fake.image_url(),
            'description': fake.text(),
        }
        events_data.append(event_data)

    for event_data in events_data:
        event = Event(**event_data)
        session.add(event)
    session.commit()


# Генерация данных для матчей
def generate_fake_matches(session):
    events = session.query(Event).all()

    for event in events:
        # Получим случайное количество матчей (от 1 до 10) для каждого мероприятия
        num_matches = random.randint(1, 10)

        for _ in range(num_matches):
            combat_type = session.query(CombatType).order_by(func.random()).first()
            start_datetime = fake.date_time_this_year(before_now=True, after_now=False, tzinfo=None)
            end_datetime = start_datetime + datetime.timedelta(hours=2)
            nominal_time = random.randint(5, 10)
            mat_vol = random.randint(1, 5)

            match = Match(
                name=fake.sentence(),
                event_id=event.id,
                combat_type_id=combat_type.id,
                start_datetime=start_datetime,
                end_datetime=end_datetime,
                nominal_time=nominal_time,
                mat_vol=mat_vol,
            )

            session.add(match)

    session.commit()


# генерация данных про мачти, остальных
def generate_fake_matches_info(session):
    matches = session.query(Match).all()
    categorys = session.query(CategoryType).all()
    sports = session.query(SportType).all()
    weight_classes = session.query(AllWeightClass).all()

    categorys_ids = [category.id for category in categorys]
    sports_ids = [sport.id for sport in sports]
    weight_ids = [weight_class.id for weight_class in weight_classes]

    for match in matches:
        match_category = MatchCategory(
            match_id=match.id,
            category_id=random.choice(categorys_ids)
        )
        session.add(match_category)

        match_sport = MatchSport(
            match_id=match.id,
            sport_id=random.choice(sports_ids)
        )
        session.add(match_sport)

        match_weight = MatchWeights(
            match_id=match.id,
            weight_id=random.choice(weight_ids)
        )
        session.add(match_weight)

        match_gender = MatchGender(
            match_id=match.id,
            gender=random.choice([True, False])
        )
        session.add(match_gender)

        match_age = MatchAge(
            match_id=match.id,
            age_from=random.randint(5, 15),
            age_till=random.randint(16, 40)
        )
        session.add(match_age)

    session.commit()


# Генерация участников матчей
def generate_fake_match_participants(session):
    matches = session.query(Match).all()
    participants = session.query(Athlete).all()
    teams = session.query(Team).all()

    participants_ids = [participant.id for participant in participants]
    teams_ids = [team.id for team in teams]

    for match in matches:

        # Получим случайное количество атлетов (от 1 до 32) для каждого матча
        num_athletes = random.randint(1, 32)

        for _ in range(num_athletes):
            match_participants = MatchParticipant(
                match_id=match.id,
                player_id=random.choice(participants_ids),
                team_id=random.choice(teams_ids)
            )
            session.add(match_participants)
    session.commit()


# Генерация данных для судей матча
def generate_fake_match_referees(session):
    matches = session.query(Match).all()

    for match in matches:
        # Получим случайное количество судей (от 1 до 3) для каждого матча
        num_referees = random.randint(1, 3)

        for _ in range(num_referees):
            # Получим случайного судью (Referee) для текущего матча
            referee = session.query(Referee).order_by(func.random()).first()

            # Определим, является ли судья главным судьей (50% вероятность)
            is_chief = random.choice([True, False])

            # Создадим запись о судье для текущего матча
            match_referee = MatchReferee(match_id=match.id, referee_id=referee.id, chief=is_chief)
            session.add(match_referee)

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


# generate_fake_countries(session)
# generate_fake_roles(session)

# generate_fake_combat_types(session)
# generate_fake_category_types(session)
# generate_fake_sport_types(session)
# generate_fake_weight_classes(session)
# generate_fake_referee_types(session)
# generate_fake_coach_types(session)

# generate_fake_users(session, num_users)
# generate_fake_coaches(session)
# generate_fake_referees(session)
# generate_fake_athletes(session)
# generate_fake_event_organizers(session)
# generate_fake_spectators(session)
# generate_fake_system_administrators(session)

# generate_fake_teams_0(session)
# generate_fake_teams(session)
# generate_fake_team_member(session)

# generate_fake_events(session)
generate_fake_matches(session)
generate_fake_matches_info(session)
generate_fake_match_participants(session)
# generate_fake_match_results(session)
# generate_fake_match_periods(session)

# generate_fake_prizes(session)
# generate_fake_medals(session)
# generate_fake_links(session)
