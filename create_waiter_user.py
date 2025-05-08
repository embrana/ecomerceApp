import sqlite3
import sys

# Connect to the database
conn = sqlite3.connect('/tmp/test.db')
cursor = conn.cursor()

# Create the user table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_cliente BOOLEAN NOT NULL DEFAULT 1,
    is_cocina BOOLEAN NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    is_waiter BOOLEAN NOT NULL DEFAULT 0
)
''')

# Check if the waiter user already exists
cursor.execute('SELECT id FROM "user" WHERE email = ?', ("waiter@test.com",))
waiter_exists = cursor.fetchone()

if not waiter_exists:
    # Create a waiter user
    cursor.execute('''
    INSERT INTO "user" (email, password, is_active, is_cliente, is_cocina, is_admin, is_waiter)
    VALUES (?, ?, 1, 0, 0, 0, 1)
    ''', ("waiter@test.com", "waiter123"))
    print("Waiter user created successfully!")
else:
    # Update the existing user to make sure is_waiter is set to true
    cursor.execute('''
    UPDATE "user" SET is_waiter = 1 WHERE email = ?
    ''', ("waiter@test.com",))
    print("Waiter user already exists, updated is_waiter flag")

# Create an admin user if it doesn't exist
cursor.execute('SELECT id FROM "user" WHERE email = ?', ("admin@test.com",))
admin_exists = cursor.fetchone()

if not admin_exists:
    # Create an admin user
    cursor.execute('''
    INSERT INTO "user" (email, password, is_active, is_cliente, is_cocina, is_admin, is_waiter)
    VALUES (?, ?, 1, 0, 0, 1, 0)
    ''', ("admin@test.com", "admin123"))
    print("Admin user created successfully!")
else:
    print("Admin user already exists")

# Commit the changes
conn.commit()

# List all users
cursor.execute('SELECT id, email, is_active, is_cliente, is_cocina, is_admin, is_waiter FROM "user"')
users = cursor.fetchall()

print("\nUser list:")
print("{:<5} {:<20} {:<10} {:<10} {:<10} {:<10} {:<10}".format(
    "ID", "Email", "Active", "Cliente", "Cocina", "Admin", "Waiter"))
print("-" * 80)

for user in users:
    print("{:<5} {:<20} {:<10} {:<10} {:<10} {:<10} {:<10}".format(
        user[0], user[1], user[2], user[3], user[4], user[5], user[6]))

# Close the connection
conn.close()

print("\nYou can now log in with:")
print("Waiter: waiter@test.com / waiter123")
print("Admin: admin@test.com / admin123")