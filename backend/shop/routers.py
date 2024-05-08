import os
import uuid
from datetime import datetime

import qrcode
from aiofiles import open as async_open
from fastapi import (APIRouter, Depends, File, HTTPException, Request,
                     UploadFile)
from fpdf import FPDF
from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from auth.models import Athlete, EventOrganizer
from auth.routes import current_user
from auth.schemas import UserDB
from connection import get_db
from event.models import Event
from shop.models import (Courses, Engagement, Merch, Order, OrderItem, Place,
                         Row, Sector, Ticket)
from shop.schemas import MerchCreate, MerchUpdate, TicketCreate
from teams.models import TeamMember

router = APIRouter(prefix="/shop", tags=["Shop"])


''' Билеты '''


@router.post("/events/{event_id}/tickets/create")
async def create_ticket(
    event_id: int,
    sectors: int,
    rows: int,
    place: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user),
):
    query = await db.execute(select(EventOrganizer.id))
    organizers = query.scalars().all()
    if current_user.id not in organizers:
        raise HTTPException(status_code=401, detail="Not an organizer")
    for i in range(sectors):
        await db.execute(insert(Sector).values(
            event_id=event_id,
            name=f"Sector {i+1}",
        ))
        await db.commit()
    query = await db.execute(select(Sector.id))
    sectors = query.scalars().all()
    for sector in sectors:
        for j in range(rows):
            await db.execute(insert(Row).values(
                sector_id=sector,
                number=j+1,
            ))
            await db.commit()
    query = await db.execute(select(Row.id))
    rows = query.scalars().all()
    for row in rows:
        for k in range(place):
            await db.execute(insert(Place).values(
                row_id=row,
                number=k+1,
            ))
            await db.commit()
    query = await db.execute(select(Place.id))
    places = query.scalars().all()
    for place in places:
        await db.execute(insert(Ticket).values(
                    event_id=event_id,
                    organizer_id=current_user.id,
                    place=place,
                    price=1000,  # Подумать как внутри сектора выставить разные цены билетов
                    uu_key=str(uuid.uuid4()),
                ))
    await db.commit()
    return {"status": "ok"}


@router.get("/events/{event_id}/tickets")
async def get_tickets(event_id: int,
                      db: AsyncSession = Depends(get_db)):

    # показываем количество оставшихся билетов
    query = await db.execute(select(
        Ticket.id, Ticket.place, Ticket.price, Ticket.status
        ).where(Ticket.event_id == event_id, Ticket.status == "available"))
    tikets = query.mappings().all()

    return {'Мест осталось:': len(tikets), 'Билеты доступны': tikets}


@router.get("/tickets/{event_id}/{ticket_id}")
async def get_ticket(
    event_id: int,
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Ticket).where(
        Ticket.event_id == event_id, Ticket.id == ticket_id))
    ticket = query.scalars().one_or_none()

    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


# Сохранение билета
@router.get("/tickets/{event_id}/{tiket_id}/download")
async def download_ticket(
    event_id: int,
    ticket_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Ticket.id, Ticket.place, Ticket.price).where(
        Ticket.event_id == event_id,
        Ticket.id == ticket_id,
        Ticket.status == "sold_out"))
    ticket = query.mappings().one_or_none()

    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    query = await db.execute(select(Event.name).where(Event.id == event_id))
    event_name = query.scalars().one_or_none()

    query = await db.execute(select(Ticket.uu_key).where(
        Ticket.event_id == event_id,
        Ticket.id == ticket_id,
        Ticket.status == "sold_out"))
    uu_key = query.scalars().one_or_none()

    # TODO вытащить ряд и сектор из таблиц
    # TODO добавить их в билет

    pdf = FPDF(font_cache_dir=None)
    pdf.add_page()
    pdf.add_font("dejavu-sans", style="", fname="DejaVuSans.ttf")
    pdf.set_font(family="dejavu-sans", style="", size=12)
    pdf.cell(text=(f"Event: {event_name}\n"), ln=1)
    for key, value in ticket.items():
        pdf.cell(0, 6, txt=(f"{key}: {value}\n"), ln=1)
    img = qrcode.make(f"http://127.0.0.1:8000/shop/tickets/{event_id}/{ticket_id}/{uu_key}/check")
    img.save("qrcode.png")
    pdf.image("qrcode.png", x=5, y=30, w=50, h=50)
    pdf.output("Ticket.pdf")

    return ticket


# проверка билета
@router.get("/tickets/{event_id}/{ticket_id}/{uu_key}/check")
async def check_ticket(
    event_id: int,
    ticket_id: int,
    uu_key: str,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Ticket.status).where(
        Ticket.event_id == event_id,
        Ticket.id == ticket_id,
        Ticket.uu_key == uu_key))
    ticket = query.scalars().one_or_none()
    print(ticket)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket == "reserved":
        raise HTTPException(status_code=400, detail="Ticket not paid")
    if ticket == "sold_out":
        await db.execute(update(Ticket).where(Ticket.id == ticket_id).values(
            status="used"))
        await db.commit()
        return {"Билет принят"}


''' Билеты для спортсменов, которые участвуют в событии '''


@router.post("/events/{event_id}/tickets/athletes/create")
async def create_tickets_for_athletes(
    event_id: int,
    price: float,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Event.organizer_id).where(
        Event.id == event_id))
    organizer_id = query.scalars().one_or_none()
    query = await db.execute(select(EventOrganizer.id).where(
        EventOrganizer.id == organizer_id))
    organizer = query.scalars().one_or_none()

    if organizer != current_user.id:
        raise HTTPException(status_code=404, detail="You not Organizer")
    else:
        query = await db.execute(select(
            Participant.player_id).where(Participant.event_id == event_id))
        all_participants = query.scalars().all()

        query = await db.execute(select(Engagement.id).where(
            Event.id == event_id))
        engagement_tikets = query.scalars().all()

        if len(engagement_tikets) == len(all_participants):
            raise HTTPException(status_code=404,
                                detail="Tickets already created")
        else:
            for _ in range(len(all_participants)):
                await db.execute(insert(Engagement).values(
                    organizer_id=organizer_id,
                    event_id=event_id,
                    price=price,
                    status="available",
                    uu_key=str(uuid.uuid4())
                    ))
                await db.commit()
    return {"Создано билетов": len(all_participants)}


@router.get("/tickets/{event_id}/athletes/")
async def get_tickets_for_engagement(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Engagement.id,
        Engagement.event_id,
        Engagement.price,
        Engagement.status).where(Engagement.event_id == event_id))
    tikets_engagement = query.mappings().all()

    return tikets_engagement


@router.get("/tickets/{event_id}/athletes/order/{ticket_id}")
async def order_tickets_for_engagement(
    event_id: int,
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    all_users = []
    all_team_members = []
    query = await db.execute(select(
        Participant.player_id).where(Participant.event_id == event_id))
    all_participants = query.scalars().all()

    for participant in all_participants:
        query = await db.execute(select(TeamMember.member).where(
            TeamMember.id == participant))
        team_member = query.scalars().one_or_none()
        all_team_members.append(team_member)

    for athlete in all_team_members:
        query = await db.execute(select(Athlete.user_id).where(
            Athlete.id == athlete))
        user_id = query.scalars().one_or_none()
        all_users.append(user_id)

    if current_user.id not in all_users:
        raise HTTPException(status_code=400,
                            detail="Вы не участник данного мероприятия")

    query = await db.execute(select(Engagement.price).where(
            Engagement.id == ticket_id,
            Engagement.status == 'available'))
    ticket_price = query.scalars().one_or_none()
    if ticket_price is None:
        raise HTTPException(status_code=404, detail="Ticket reserved")

    new_order = Order(
        user_id=current_user.id,
        created_at=datetime.now()
    )
    db.add(new_order)
    await db.commit()

    new_order_item = OrderItem(
            order_id=new_order.id,
            product_type="engagement",
            product_id=ticket_id,
            quantity=1,
            total_price=ticket_price)
    db.add(new_order_item)

    await db.execute(update(Engagement).where(
            Engagement.id == ticket_id).values(status='reserved'))
    await db.commit()

    return {'Order created': new_order.id}


''' Мерч '''


@router.get("/merch/{organizer_id}")
async def get_merch(
    organizer_id: int,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(Merch).where(
        Merch.organizer_id == organizer_id))
    merch = query.scalars().all()
    return merch


@router.post("/merch/create")
async def create_merch(
    merch: MerchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(EventOrganizer.id))
    organizer_id = query.scalars().all()

    if current_user.id not in organizer_id:
        raise HTTPException(status_code=400, detail="Bad request")

    new_merch = Merch(
        name=merch.name,
        description=merch.description,
        price=merch.price,
        organizer_id=current_user.id,
    )
    db.add(new_merch)
    await db.commit()

    return {'Merch created': merch.name}


@router.post("/merch/upload_image/{merch_id}")
async def upload_image_in_merch(
    merch_id: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(EventOrganizer.id))
    organizer_id = query.scalars().all()

    if current_user.id not in organizer_id:
        raise HTTPException(status_code=400, detail="Bad request")

    query = await db.execute(select(Merch).where(Merch.id == merch_id))
    merch = query.scalars().one_or_none()

    if merch is None:
        raise HTTPException(status_code=404, detail="Merch not found")

    if image.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=406,
                            detail="Only .jpeg or .png files allowed")

    image_name = f"{uuid.uuid4().hex}.{image.filename.split('.')[-1]}"
    image_path = os.path.join("static/merch", image_name)

    async with async_open(image_path, "wb") as f:
        await f.write(await image.read())

    # Создаем директорию, если она не существует
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    merch.image_field = f"/static/merch/{image_name}"
    await db.commit()

    return {'Merch updated': merch.name}


@router.put("/merch/update/{merch_id}")
async def update_merch(merch_id: int,
                       merch: MerchUpdate,
                       db: AsyncSession = Depends(get_db),
                       current_user: UserDB = Depends(current_user)):
    query = await db.execute(select(EventOrganizer.id))
    organizer_id = query.scalars().all()
    try:
        if current_user.id in organizer_id:
            query = await db.execute(update(Merch).where(
                Merch.id == merch_id).values(
                name=merch.name,
                description=merch.description,
                price=merch.price,
                image_field=merch.image_field
            ))
            await db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Bad request")
    return {'Merch updated': merch.name}


@router.delete("/merch/delete/{merch_id}")
async def delete_merch(
    merch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(EventOrganizer.id))
    organizer_id = query.scalars().all()
    try:
        if current_user.id in organizer_id:
            query = await db.execute(delete(Merch).where(
                Merch.id == merch_id))
            await db.commit()
            return {'Merch deleted': merch_id}
    except Exception:
        raise HTTPException(status_code=400, detail="Bad request")


''' Абонименты '''


@router.get("/plans")
async def get_plans(
    db: AsyncSession = Depends(get_db)
):
    # TODO сделать привязку по гео
    query = await db.execute(select(Courses))
    plans = query.scalars().all()
    return plans


''' Заказы '''


@router.get("/orders")
async def get_orders(
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Order).where(
        Order.user_id == current_user.id))
    orders = query.scalars().all()
    return orders


@router.get("/orders/{order_id}")
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Order).where(
        Order.user_id == current_user.id, Order.id == order_id))
    order = query.scalars().one_or_none()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/create")
async def create_order(
    product_type: str,
    product_id: int,
    quantity: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    new_order = Order(
        user_id=current_user.id,
        created_at=datetime.now()
    )
    db.add(new_order)
    await db.commit()
    if product_type == "ticket":
        query = await db.execute(select(Ticket.price).where(
            Ticket.id == product_id))
        ticket_price = query.scalars().one_or_none()
        new_order_item = OrderItem(
            order_id=new_order.id,
            product_type=product_type,
            product_id=product_id,
            quantity=quantity,
            total_price=quantity * ticket_price
        )
        db.add(new_order_item)
        await db.commit()
        await db.execute(update(Ticket).where(
            Ticket.id == product_id).values(status='reserved'))  # может быть "available", "reserved", "sold_out", "used"
        # Подумать как можно купить несколько билетов
        # передать список билетов в запрос

    if product_type == "merch":
        query = await db.execute(select(Merch.price).where(
            Merch.id == product_id))
        price = query.scalars().one_or_none()
        new_order_item = OrderItem(
            order_id=new_order.id,
            product_type=product_type,
            product_id=product_id,
            quantity=quantity,
            total_price=quantity * price
        )
        db.add(new_order_item)

    if product_type == "courses":
        query = await db.execute(select(Courses.price).where(
            Courses.id == product_id))
        price = query.scalars().one_or_none()
        new_order_item = OrderItem(
            order_id=new_order.id,
            product_type=product_type,
            product_id=product_id,
            quantity=quantity,
            total_price=quantity * price
        )
        db.add(new_order_item)
    await db.commit()

    return {'Order created': new_order.id}


# TODO сделать эндпоинт подать на возврат оплаты

@router.post("/orders/cancel/{order_id}")
async def cancel_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Order).where(
        Order.user_id == current_user.id, Order.id == order_id))
    order = query.scalars().one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    query = await db.execute(select(
        OrderItem.product_type,
        OrderItem.product_id).where(
            OrderItem.order_id == order_id))
    order_items = query.mappings().all()

    if order_items[0]['product_type'] == 'ticket':
        await db.execute(update(Ticket).where(
            Ticket.id == order_items[0]['product_id']).values(
                status='available'))
    if order_items[0]['product_type'] == 'engagement':
        await db.execute(update(Engagement).where(
            Engagement.id == order_items[0]['product_id']).values(
                status='available'))

    await db.execute(delete(OrderItem).where(OrderItem.order_id == order_id))
    await db.execute(delete(Order).where(
        Order.id == order_id))
    await db.commit()

    return {'Order canceled': order_id}


''' Платежи '''


@router.post("/payments/{payment_method}/orders/{order_id}")
async def create_payment(
    payment_method: str,
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    pass
