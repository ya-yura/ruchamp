import uuid
from typing import Optional

from fastapi import Depends, HTTPException, Request, BackgroundTasks
from fastapi_users import (BaseUserManager, IntegerIDMixin, exceptions, models,
                           schemas)
from sqlalchemy import select

from auth.mailer import send_verification_email
from auth.models import (AllWeightClass, Athlete, Coach, CombatType,
                         EventOrganizer, Referee, Role, Spectator,
                         SystemAdministrator)
from auth.schemas import (AthleteUpdate, OrganizerUpdate, RefereeUpdate,
                          SpectatorUpdate, SysAdminUpdate)
from config import SECRET
from connection import User, get_user_db


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def get_combat_types_by_names(self, names):
        query = select(CombatType).where(CombatType.name.in_(names))
        combat_types = await self.database.fetch_all(query)
        return combat_types

    async def get_coaches_by_names(self, names):
        query = select(Coach).where(Coach.name.in_(names))
        coaches = await self.database.fetch_all(query)
        return coaches

    async def create(
        self,
        user_create: schemas.UC,
        safe: bool = False,
        request: Optional[Request] = None,
        background_tasks: Optional[BackgroundTasks] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise HTTPException(status_code=403, detail="User already exists")

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        user_dict["verification_token"] = str(uuid.uuid4())

        created_user = await self.user_db.create(user_dict)

        # Call the on_after_register method to send the verification email
        await self.on_after_register(created_user, request, background_tasks)
        # await self.on_after_register(created_user, request)

        return created_user

    async def on_after_register(
        self,
        user: User,
        request: Optional[Request] = None,
        background_tasks: BackgroundTasks = None
    ):
        if background_tasks:
            background_tasks.add_task(
                send_verification_email,
                user.username,
                user.email,
                user.verification_token
            )
        else:
            send_verification_email(
                user.username, user.email, user.verification_token
            )

    async def update_athlete_profile(
        self,
        user: User,
        athlete_data: AthleteUpdate,
        request: Optional[Request] = None
    ) -> Athlete:
        athlete = await self.get_athlete_profile(user)
        for field, value in athlete_data.dict().items():
            if field == 'combat_types':
                # Обработка видов борьбы
                combat_types = await self.user_db.get_combat_types_by_names(
                    value
                )
                athlete.combat_types = combat_types
            elif field == 'coaches':
                # Обработка тренеров
                coaches = await self.user_db.get_coaches_by_names(value)
                athlete.coaches = coaches
            else:
                setattr(athlete, field, value)

        await self.user_db.update(athlete)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return athlete

    async def update_spectator_profile(
        self,
        user: User,
        spectator_data: SpectatorUpdate,
        request: Optional[Request] = None
    ) -> Spectator:
        spectator = await self.get_spectator_profile(user)
        for field, value in spectator_data.dict().items():
            setattr(spectator, field, value)
        await self.user_db.update(spectator)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return spectator

    async def update_sysadmin_profile(
        self,
        user: User,
        sysadmin_data: SysAdminUpdate,
        request: Optional[Request] = None
    ) -> SystemAdministrator:
        sysadmin = await self.get_sysadmin_profile(user)
        for field, value in sysadmin_data.dict().items():
            setattr(sysadmin, field, value)
        await self.user_db.update(sysadmin)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return sysadmin

    async def update_organizer_profile(
        self,
        user: User,
        organizer_data: OrganizerUpdate,
        request: Optional[Request] = None
    ) -> EventOrganizer:
        organizer = await self.get_organizer_profile(user)
        for field, value in organizer_data.dict().items():
            setattr(organizer, field, value)
        await self.user_db.update(organizer)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return organizer

    async def update_referee_profile(
        self,
        user: User,
        referee_data: RefereeUpdate,
        request: Optional[Request] = None
    ) -> Referee:
        referee = await self.get_referee_profile(user)
        for field, value in referee_data.dict().items():
            setattr(referee, field, value)
        await self.user_db.update(referee)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return referee

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        send_verification_email(user.username, user.email, token)
        print(f"User {user.id} has forgot password. Reset token: {token}")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
