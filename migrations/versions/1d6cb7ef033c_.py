"""empty message

Revision ID: 1d6cb7ef033c
Revises: b0aec2ae600a
Create Date: 2024-01-25 13:39:12.596549

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d6cb7ef033c'
down_revision: Union[str, None] = 'b0aec2ae600a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
