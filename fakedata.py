from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy import select
from connection import get_db, SessionLocal
from auth.models import User, Athlete, EventOrganizer, Spectator, SystemAdministrator, Team, Role, TeamMember
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi_users.db import SQLAlchemyUserDatabase
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
from auth.models import Base, User, Role

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

user_db = SQLAlchemyUserDatabase(User, SessionLocal())

fake = Faker("ru_RU")

session = SessionLocal()


def generate_fake_data():
    # Генерация пользователей и связанных данных
    roles = session.execute(select(Role)).scalars().all()

    for _ in range(200):
        role = fake.random_element(roles)
        user = User(
            email=fake.email(),
            username=fake.user_name(),
            role_id=role.id,
            hashed_password=fake.password(),
            is_active=fake.boolean(chance_of_getting_true=75),
            is_superuser=fake.boolean(chance_of_getting_true=3),
            is_verified=fake.boolean(chance_of_getting_true=75),
            verification_token=fake.uuid4(),
        )
        session.add(user)

    session.commit()

    users = session.execute(select(User)).scalars().all()

    for _ in range(200):
        cur_user = fake.random_element(users)

        athlete = Athlete(
            user_id=cur_user.id,
            weight_category=fake.random_element(["Наилегчайший", "Легчайший", "Полулёгкий", "Лёгкий", "Полусредний", "Первый средний", "Второй средний", "Средний", "Полутяжёлый", "Тяжёлый", "Сверхтяжёлый"]),
            belt_rank=fake.random_element(["Чёрный", "Белый", "Красный", "Жёлтый", "Зелёный", "Синий"]),
            coach_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            height=fake.random_int(min=120, max=200),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            image_field=fake.image_url(),
        )
        session.add(athlete)

    for _ in range(30):
        cur_user = fake.random_element(users)

        organizer = EventOrganizer(
            user_id=cur_user.id,
            organization_name=fake.company(),
            website=fake.url(),
            contact_email=fake.email(),
            contact_phone=fake.phone_number(),
            description=fake.text(),
            image_field=fake.image_url(),
        )
        session.add(organizer)

    for _ in range(150):
        cur_user = fake.random_element(users)

        spectator = Spectator(
            user_id=cur_user.id,
            full_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            phone_number=fake.phone_number(),
            image_field=fake.image_url(),
        )
        session.add(spectator)

    for _ in range(10):
        cur_user = fake.random_element(users)

        sys_admin = SystemAdministrator(
            user_id=cur_user.id,
            full_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            image_field=fake.image_url(),
        )
        session.add(sys_admin)

    for _ in range(50):
        cur_user = fake.random_element(users)

        team = Team(
            captain=cur_user.id,
            name=fake.word(),
            invite_link=fake.uuid4(),
            description=fake.text(),
            slug=fake.slug(),
            image_field=fake.image_url(),
        )
        session.add(team)

    session.commit()

    # Генерация связей между командами и участниками
    teams = session.execute(select(Team)).scalars().all()
    users = session.execute(select(User)).scalars().all()

    for _ in range(50):
        cur_team = fake.random_element(teams)
        iterations = random.randint(3, 27)

        for _ in range(iterations):
            team_member = TeamMember(
                team=cur_team.id,
                member=fake.random_element(users).id,
            )
            session.add(team_member)

    session.commit()


generate_fake_data()
