from auth.models import Team
from team.base import BaseServicesTeam


class TeamServices(BaseServicesTeam):
    model = Team
