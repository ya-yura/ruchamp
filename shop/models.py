from datetime import datetime
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey, Float, Enum, DateTime

from auth.models import Base, EventOrganizer, User

from connection import Base


metadata = Base.metadata


class Ticket(Base):
    __tablename__ = "Ticket"
    id = Column(Integer, primary_key=True)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id), nullable=False)
    event_id = Column(Integer, ForeignKey("Event.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    status = Column(Enum("available", "sold_out", name="ticket_status"), nullable=False, default="available")
    image_field = Column(String, nullable=True)


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


class OrderItem(Base):
    __tablename__ = "OrderItem"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    product_type = Column(String, nullable=False)  # Может быть "merch", "courses" или "ticket"
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)


class Order(Base):
    __tablename__ = "Order"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    organizer_id = Column(Integer, ForeignKey(EventOrganizer.id), nullable=False)
    items = relationship("OrderItem", back_populates="order")
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("pending", "completed", "canceled", name="order_status"), nullable=False, default="pending")


class Transaction(Base):
    __tablename__ = "Transaction"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    payment_method = Column(String, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)


