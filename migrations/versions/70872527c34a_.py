"""empty message

Revision ID: 70872527c34a
Revises: 94a909ac1948
Create Date: 2024-01-25 13:37:46.496917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '70872527c34a'
down_revision: Union[str, None] = '94a909ac1948'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
