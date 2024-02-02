from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy import create_engine, Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from connection import get_db
from auth.models import User, Athlete, EventOrganizer, Spectator, SystemAdministrator, Team, Role

Base = declarative_base()


def generate_fake_data():
    fake = Faker("ru_RU")

    db = get_db

    roles = db.query(Role).all()


    for _ in range(50):
        role = fake.random_element(roles)
        user = User(
            email=fake.email(),
            username=fake.user_name(),
            role_id=role.id,
            hashed_password=fake.password(),
            is_active=fake.boolean(),
            is_superuser=fake.boolean(),
            is_verified=fake.boolean(),
            verification_token=fake.uuid4(),
        )
        db.add(user)

        athlete = Athlete(
            user_id=user.id,
            weight_category=fake.word(),
            belt_rank=fake.random_element(["Чёрный", "Белый", "Красный"]),
            coach_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            height=fake.random_element(["Short", "Average", "Tall"]),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            image_field=fake.image_url(),
        )
        db.add(athlete)

        organizer = EventOrganizer(
            user_id=user.id,
            organization_name=fake.company(),
            website=fake.url(),
            contact_email=fake.email(),
            contact_phone=fake.phone_number(),
            description=fake.text(),
            image_field=fake.image_url(),
        )
        db.add(organizer)

        spectator = Spectator(
            user_id=user.id,
            full_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            phone_number=fake.phone_number(),
            image_field=fake.image_url(),
        )
        db.add(spectator)

        sys_admin = SystemAdministrator(
            user_id=user.id,
            full_name=fake.name(),
            birthdate=fake.date_of_birth(minimum_age=18, maximum_age=65),
            gender=fake.random_element(["Male", "Female"]),
            country=fake.country(),
            image_field=fake.image_url(),
        )
        db.add(sys_admin)

        team = Team(
            captain=user.id,
            name=fake.word(),
            invite_link=fake.uuid4(),
            description=fake.text(),
            slug=fake.slug(),
            image_field=fake.image_url(),
        )
        db.add(team)

        team_member = TeamMember(
            team_id=team.id,
            member=user.id,
        )
        db.add(team_member)

    db.commit()

# Заполняем базу данных
generate_fake_data()
