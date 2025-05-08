import sqlite3

# Connect to the database
conn = sqlite3.connect('/tmp/test.db')
cursor = conn.cursor()

# Create the table table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "table" (
    id INTEGER PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    name TEXT,
    capacity INTEGER NOT NULL DEFAULT 4,
    is_occupied BOOLEAN NOT NULL DEFAULT 0
)
''')

# Add is_waiter column to user table if it doesn't exist
cursor.execute("PRAGMA table_info(user)")
columns = cursor.fetchall()
column_names = [col[1] for col in columns]

if 'is_waiter' not in column_names:
    cursor.execute('ALTER TABLE "user" ADD COLUMN is_waiter BOOLEAN NOT NULL DEFAULT 0')

# Add table_id column to order table if it doesn't exist
cursor.execute("PRAGMA table_info('order')")
columns = cursor.fetchall()
column_names = [col[1] for col in columns]

if 'table_id' not in column_names:
    cursor.execute('ALTER TABLE "order" ADD COLUMN table_id INTEGER REFERENCES "table"(id)')

# Add is_open column to order table if it doesn't exist
if 'is_open' not in column_names:
    cursor.execute('ALTER TABLE "order" ADD COLUMN is_open BOOLEAN NOT NULL DEFAULT 1')

# Add added_at column to order_product table if it doesn't exist
cursor.execute("PRAGMA table_info(order_product)")
columns = cursor.fetchall()
column_names = [col[1] for col in columns]

if 'added_at' not in column_names:
    cursor.execute('ALTER TABLE order_product ADD COLUMN added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')

# Clear and insert sample tables
cursor.execute('DELETE FROM "table"')
for i in range(1, 6):
    cursor.execute('INSERT INTO "table" (number, name, capacity, is_occupied) VALUES (?, ?, ?, ?)', 
                   (i, f"Mesa {i}", 4, 0))

# Update a user to be a waiter
cursor.execute('UPDATE "user" SET is_waiter = 1 WHERE id = 1')

# Commit the changes
conn.commit()

# Verify the table was created successfully
cursor.execute('SELECT * FROM "table"')
rows = cursor.fetchall()
print(f"Created {len(rows)} sample tables:")
for row in rows:
    print(row)

# Close the connection
conn.close()