"""empty message

Revision ID: 92194f2936e5
Revises: 39ae4922d331
Create Date: 2024-01-24 17:43:35.237302

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92194f2936e5'
down_revision: Union[str, None] = '39ae4922d331'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
