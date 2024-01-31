from auth.models import User
from services.base import BaseServices


class UserServices(BaseServices):
    model = User
