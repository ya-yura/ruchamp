"""empty message

Revision ID: 0f99bbaee2cb
Revises: 6f8b79e3d182
Create Date: 2024-01-25 13:26:20.715308

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f99bbaee2cb'
down_revision: Union[str, None] = '6f8b79e3d182'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
