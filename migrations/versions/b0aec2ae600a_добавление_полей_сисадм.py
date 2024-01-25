"""Добавление полей сисадм

Revision ID: b0aec2ae600a
Revises: 70872527c34a
Create Date: 2024-01-25 13:38:41.488334

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b0aec2ae600a'
down_revision: Union[str, None] = '70872527c34a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('SystemAdministrator', sa.Column('nick_name', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('birthdate', sa.TIMESTAMP(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('full_name', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('contact_phone', sa.String(), nullable=True))


def downgrade() -> None:
    pass
