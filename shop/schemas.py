from pydantic import BaseModel
from typing import Optional


class Merch(BaseModel):
    name: str
    price: int
    description: str
    image_field: str

    class Config:
        from_attributes = True


class MerchUpdate(Merch):
    name: Optional[str]
    price: Optional[int]
    description: Optional[str]
    image_field: Optional[str]


class MerchCreate(Merch):
    pass


class Ticket(BaseModel):
    name: str
    price: int
    description: str
    status: str
    image_field: str

    class Config:
        from_attributes = True


class TicketCreate(Ticket):
    pass


class TicketUpdate(Ticket):
    name: Optional[str]
    price: Optional[int]
    description: Optional[str]
    image_field: Optional[str]
