"""image fields

Revision ID: 59520e4cfa98
Revises: 814dcae24fc8
Create Date: 2024-02-01 12:56:20.604539

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '59520e4cfa98'
down_revision: Union[str, None] = '814dcae24fc8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Athlete', sa.Column('image_field', sa.String(), nullable=True))
    op.drop_column('Athlete', 'photo_url')
    op.add_column('EventOrganizer', sa.Column('image_field', sa.String(), nullable=True))
    op.drop_column('EventOrganizer', 'logo_url')
    op.add_column('Spectator', sa.Column('image_field', sa.String(), nullable=True))
    op.drop_column('Spectator', 'photo_url')
    op.add_column('SystemAdministrator', sa.Column('image_field', sa.String(), nullable=True))
    op.drop_column('SystemAdministrator', 'photo_url')
    op.add_column('Team', sa.Column('image_field', sa.String(), nullable=True))
    op.drop_column('Team', 'logo_url')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Team', sa.Column('logo_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('Team', 'image_field')
    op.add_column('SystemAdministrator', sa.Column('photo_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('SystemAdministrator', 'image_field')
    op.add_column('Spectator', sa.Column('photo_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('Spectator', 'image_field')
    op.add_column('EventOrganizer', sa.Column('logo_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('EventOrganizer', 'image_field')
    op.add_column('Athlete', sa.Column('photo_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('Athlete', 'image_field')
    # ### end Alembic commands ###