"""empty message

Revision ID: 94a909ac1948
Revises: f5f2427af483
Create Date: 2024-01-25 13:36:47.052294

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94a909ac1948'
down_revision: Union[str, None] = 'f5f2427af483'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
