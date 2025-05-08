# Table Management for Small Bars

This document outlines the implementation of table management in the application, transforming it from a cafeteria management system to a system suitable for small bars.

## Overview

The new functionality allows waiters to:

1. View all tables in the bar
2. Take orders for specific tables
3. Add items to existing orders over time
4. Close orders when customers are finished
5. Monitor all active table orders from a dashboard

## Database Changes

The following database changes have been implemented:

1. **New Table Model**: Added a `Table` model with fields for number, name, capacity, and occupancy status.
2. **Updated Order Model**: Modified the `Order` model to link to tables and track if an order is still open.
3. **Updated OrderProduct Model**: Added timestamps to track when items are added to an order.
4. **User Role**: Added the `is_waiter` role to the User model.

## New API Endpoints

The following new API endpoints are available:

### Table Management
- `GET /api/tables` - List all tables with their status
- `POST /api/tables` - Create a new table (admin only)

### Table Orders
- `GET /api/tables/<table_id>/orders` - Get orders for a specific table
- `POST /api/tables/<table_id>/orders` - Create or update an order for a table
- `PATCH /api/tables/<table_id>/close` - Close an active order for a table

## New UI Pages

The following new pages have been added:

1. **Tables View** (`/waiter/tables`) - Shows all tables with their status
2. **Table Detail** (`/waiter/tables/:tableId`) - Allows taking/managing orders for a specific table
3. **Waiter Dashboard** (`/waiter/dashboard`) - Shows all active orders across all tables

## How to Use

1. Login as a user with the waiter role
2. Navigate to the Tables view
3. Click on a table to create an order or add to an existing order
4. View all active orders in the Waiter Dashboard
5. Update order status or close orders as needed

## Setup Instructions

After deploying the application, you'll need to:

1. Run database migrations to apply the schema changes:
   ```
   python -m flask db upgrade
   ```

2. Create tables from the admin interface
3. Create or update users to have the waiter role

## Feature Limitations

- Currently, orders for a table can be modified, but individual items can't be removed
- Payment processing functionality is not yet integrated with the table management system
- Reservations are not yet linked with table assignments