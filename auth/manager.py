from typing import Optional
import uuid

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas
from auth.models import Athlete, Spectator, SystemAdministrator, EventOrganizer

from auth.schemas import AthleteUpdate, SpectatorUpdate, SysAdminUpdate, OrganizerUpdate
from connection import User, get_user_db
from auth.mailer import send_verification_email
from config import SECRET


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def create(
        self,
        user_create: schemas.UC,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        user_dict["role_id"] = 1
        user_dict["verification_token"] = str(uuid.uuid4())

        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user

    async def on_after_register(
        self,
        user: User,
        request: Optional[Request] = None
    ):
        send_verification_email(
            user.username, user.email, user.verification_token
        )

    async def update_athlete_profile(
        self, user: User, athlete_data: AthleteUpdate, request: Optional[Request] = None
    ) -> Athlete:
        athlete = await self.get_athlete_profile(user)
        for field, value in athlete_data.dict().items():
            setattr(athlete, field, value)
        await self.user_db.update(athlete)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return athlete


    async def update_spectator_profile(
        self, user: User, spectator_data: SpectatorUpdate, request: Optional[Request] = None
    ) -> Spectator:
        spectator = await self.get_spectator_profile(user)
        for field, value in spectator_data.dict().items():
            setattr(spectator, field, value)
        await self.user_db.update(spectator)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return spectator


    async def update_sysadmin_profile(
        self, user: User, sysadmin_data: SysAdminUpdate, request: Optional[Request] = None
    ) -> SystemAdministrator:
        sysadmin = await self.get_sysadmin_profile(user)
        for field, value in sysadmin_data.dict().items():
            setattr(sysadmin, field, value)
        await self.user_db.update(sysadmin)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return sysadmin


    async def update_organizer_profile(
        self, user: User, organizer_data: OrganizerUpdate, request: Optional[Request] = None
    ) -> EventOrganizer:
        organizer = await self.get_organizer_profile(user)
        for field, value in organizer_data.dict().items():
            setattr(organizer, field, value)
        await self.user_db.update(organizer)

        # можно добавить дополнительной логики после обновления
        # например, сохранить это в логах или отправить что-нибудь пользователю

        return organizer


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)