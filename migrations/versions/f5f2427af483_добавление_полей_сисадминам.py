"""Добавление полей сисадминам

Revision ID: f5f2427af483
Revises: 0f99bbaee2cb
Create Date: 2024-01-25 13:33:15.111263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f5f2427af483'
down_revision: Union[str, None] = '0f99bbaee2cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
