"""Add table management support

Revision ID: table_management
Revises: fb4e79eb8dcf
Create Date: 2025-05-08

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'table_management'
down_revision = 'fb4e79eb8dcf'
branch_labels = None
depends_on = None


def upgrade():
    # Add is_waiter column to user table
    op.add_column('user', sa.Column('is_waiter', sa.Boolean(), nullable=False, server_default='False'))
    
    # Create table table
    op.create_table('table',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=True),
        sa.Column('capacity', sa.Integer(), nullable=False, server_default='4'),
        sa.Column('is_occupied', sa.Boolean(), nullable=False, server_default='False'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('number')
    )
    
    # Add table_id column to order table
    op.add_column('order', sa.Column('table_id', sa.Integer(), nullable=True))
    
    # Add is_open column to order table
    op.add_column('order', sa.Column('is_open', sa.Boolean(), nullable=False, server_default='True'))
    
    # Add added_at column to order_product table
    op.add_column('order_product', sa.Column('added_at', sa.DateTime(), nullable=False,
                                           server_default=sa.text('CURRENT_TIMESTAMP')))
    
    # Add foreign key from order.table_id to table.id
    op.create_foreign_key(None, 'order', 'table', ['table_id'], ['id'])


def downgrade():
    # Drop foreign key from order.table_id to table.id
    op.drop_constraint(None, 'order', type_='foreignkey')
    
    # Drop added_at column from order_product table
    op.drop_column('order_product', 'added_at')
    
    # Drop is_open column from order table
    op.drop_column('order', 'is_open')
    
    # Drop table_id column from order table
    op.drop_column('order', 'table_id')
    
    # Drop table table
    op.drop_table('table')
    
    # Drop is_waiter column from user table
    op.drop_column('user', 'is_waiter')