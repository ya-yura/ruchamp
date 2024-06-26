from datetime import datetime

from sqlalchemy import (JSON, TIMESTAMP, Column, Date, DateTime, Enum, Float,
                        ForeignKey, Integer, String)
from sqlalchemy.orm import relationship

from auth.models import EventOrganizer, User, Spectator, Athlete
from connection import Base
from event.models import Event, Match

metadata = Base.metadata


# Сектора зала
class Sector(Base):
    __tablename__ = "Sector"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id), nullable=False)
    name = Column(String, nullable=False)


# Ряды сектора
class Row(Base):
    __tablename__ = "Row"
    id = Column(Integer, primary_key=True)
    sector_id = Column(Integer, ForeignKey(Sector.id), nullable=False)
    number = Column(Integer, nullable=False)


# места ряда
class Place(Base):
    __tablename__ = "Place"
    id = Column(Integer, primary_key=True)
    row_id = Column(Integer, ForeignKey(Row.id), nullable=False)

    # сейчас это количество мест на мероприятии
    number = Column(Integer, nullable=False)


# Стоимость билета на матч для зрителя
class Ticket(Base):
    __tablename__ = "Ticket"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    price = Column(Float, nullable=False)


# Билеты зрителей
class SpectatorTicket(Base):
    __tablename__ = "SpectatorTicket"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    spectator_id = Column(
        Integer, ForeignKey(Spectator.id), nullable=False
    )
    place_id = Column(Integer, ForeignKey(Place.id), nullable=False)
    status = Column(
        Enum(
            "available",
            "reserved",
            "paid",
            "used",
            "canceled",
            name="ticket_status"
        ),
        nullable=False,
        default="available"
    )
    uu_key = Column(String, nullable=True)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow)


# Взнос на участие в мероприятии в качестве спортсмена
class Engagement(Base):
    __tablename__ = "Engagement"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    price = Column(Float, nullable=False)


# Билеты спортсменов
class AthleteTicket(Base):
    __tablename__ = "AthleteTicket"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    athlete_id = Column(Integer, ForeignKey(Athlete.id), nullable=False)
    status = Column(
        Enum(
            "available",
            "reserved",
            "paid",
            "used",
            "canceled",
            name="ticket_status"
        ),
        nullable=False,
        default="available"
    )
    uu_key = Column(String, nullable=True)


# Товары мерч
class Merch(Base):
    __tablename__ = "Merchandise"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(
        Integer,
        ForeignKey(EventOrganizer.id),
        nullable=False
    )
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_field = Column(String, nullable=True)


# Абонементы на обучающие курсы от организаторов
class Courses(Base):
    __tablename__ = "Subscription"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(
        Integer,
        ForeignKey(EventOrganizer.id),
        nullable=False
    )
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_field = Column(String, nullable=True)
    date_from = Column(DateTime, default=datetime.utcnow)
    date_till = Column(DateTime, default=datetime.utcnow)
    times = Column(Integer, nullable=True)
    uu_key = Column(String, nullable=True)


# Заказ
class Order(Base):
    __tablename__ = "Order"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    status = Column(
        Enum("pending", "completed", "canceled", name="order_status"),
        nullable=False,
        default="pending"
    )


# Перечень товаров заказа
class OrderItem(Base):
    __tablename__ = "OrderItem"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)

    # Может быть "merch", "courses", "engagement" или "ticket"
    product_type = Column(String, nullable=False)

    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)


# Транзакции
class Transaction(Base):
    __tablename__ = "Transaction"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    payment_method = Column(String, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
