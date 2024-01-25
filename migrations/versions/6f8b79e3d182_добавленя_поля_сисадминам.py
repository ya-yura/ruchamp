"""Добавление поля сисадминам

Revision ID: 6f8b79e3d182
Revises: 92194f2936e5
Create Date: 2024-01-25 13:26:12.171536

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6f8b79e3d182'
down_revision: Union[str, None] = '92194f2936e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('SystemAdministrator', sa.Column('nick_name', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('birthdate', sa.TIMESTAMP(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('full_name', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('contact_phone', sa.String(), nullable=True))


def downgrade() -> None:
    pass
