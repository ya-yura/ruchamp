from sqlalchemy import create_engine

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS

from shop.models import (Base, Sector, Row, Place, Ticket, Engagement, Merch,
                         Courses, Order, OrderItem, Transaction)


engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

Base.metadata.create_all(bind=engine)