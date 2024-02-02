"""team

Revision ID: fec1dba95c34
Revises: 7d4a82373197
Create Date: 2024-01-31 04:44:14.991595

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fec1dba95c34'
down_revision: Union[str, None] = '7d4a82373197'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Team',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('captain', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('invite_link', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('slug', sa.String(), nullable=True),
    sa.Column('logo_url', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['captain'], ['User.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('TeamMember',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('team', sa.Integer(), nullable=True),
    sa.Column('member', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['member'], ['User.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['team'], ['Team.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('SystemAdministrator', sa.Column('full_name', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('birthdate', sa.TIMESTAMP(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('country', sa.String(), nullable=True))
    op.add_column('SystemAdministrator', sa.Column('photo_url', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('SystemAdministrator', 'photo_url')
    op.drop_column('SystemAdministrator', 'country')
    op.drop_column('SystemAdministrator', 'gender')
    op.drop_column('SystemAdministrator', 'birthdate')
    op.drop_column('SystemAdministrator', 'full_name')
    op.drop_table('TeamMember')
    op.drop_table('Team')
    # ### end Alembic commands ###