import uuid
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas
from auth.models import Athlete, Spectator, SystemAdministrator, EventOrganizer

from auth.schemas import AthleteUpdate, SpectatorUpdate, SysAdminUpdate, OrganizerUpdate
from auth.database import User, get_user_db
from auth.mailer import send_verification_email
from config import SECRET
from typing import Optional, Type, Base

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

    async def update_profile(
        self,
        user: User,
        data: schemas.BaseProfileUpdate,
        model: Type[Base],
    ) -> Base:
        profile = await self.get_profile(user, model)
        for field, value in data.dict().items():
            setattr(profile, field, value)
        await self.user_db.update(profile)
        return profile

    async def update_athlete_profile(
        self, user: User, athlete_data: AthleteUpdate, request: Optional[Request] = None
    ) -> Athlete:
        return await self.update_profile(user, athlete_data, Athlete)

    async def update_spectator_profile(
        self, user: User, spectator_data: SpectatorUpdate, request: Optional[Request] = None
    ) -> Spectator:
        return await self.update_profile(user, spectator_data, Spectator)

    async def update_sysadmin_profile(
        self, user: User, sysadmin_data: SysAdminUpdate, request: Optional[Request] = None
    ) -> SystemAdministrator:
        return await self.update_profile(user, sysadmin_data, SystemAdministrator)

    async def update_organizer_profile(
        self, user: User, organizer_data: OrganizerUpdate, request: Optional[Request] = None
    ) -> EventOrganizer:
        return await self.update_profile(user, organizer_data, EventOrganizer)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
