from datetime import datetime
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey, Float, Enum, DateTime, Date

from auth.models import Base, EventOrganizer, User
from event.models import Event

from connection import Base


metadata = Base.metadata


class Sector(Base):
    __tablename__ = "Sector"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id), nullable=False)
    name = Column(String, nullable=False)


class Row(Base):
    __tablename__ = "Row"
    id = Column(Integer, primary_key=True)
    sector_id = Column(Integer, ForeignKey(Sector.id), nullable=False)
    number = Column(Integer, nullable=False)


class Place(Base):
    __tablename__ = "Place"
    id = Column(Integer, primary_key=True)
    row_id = Column(Integer, ForeignKey(Row.id), nullable=False)
    number = Column(Integer, nullable=False)


class Ticket(Base):
    __tablename__ = "Ticket"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id), nullable=False)
    event_id = Column(Integer, ForeignKey(Event.id), nullable=False)
    day = Column(DateTime, nullable=True)
    place = Column(Integer, ForeignKey(Place.id), nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Enum("available", "reserved", "sold_out", "used", name="ticket_status"), nullable=False, default="available")
    uu_key = Column(String, nullable=True)


class Merch(Base):
    __tablename__ = "Merchandise"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_field = Column(String, nullable=True)


class Courses(Base):
    __tablename__ = "Subscription"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_field = Column(String, nullable=True)
    uu_key = Column(String, nullable=True)


class Order(Base):
    __tablename__ = "Order"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    items = relationship("OrderItem", back_populates="order")
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("pending", "completed", "canceled", name="order_status"), nullable=False, default="pending")


class OrderItem(Base):
    __tablename__ = "OrderItem"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    product_type = Column(String, nullable=False)  # Может быть "merch", "courses" или "ticket"
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)


class Transaction(Base):
    __tablename__ = "Transaction"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    payment_method = Column(String, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)


