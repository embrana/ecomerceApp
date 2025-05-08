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

# Clear and insert sample tables
cursor.execute('DELETE FROM "table"')
for i in range(1, 6):
    cursor.execute('INSERT INTO "table" (number, name, capacity, is_occupied) VALUES (?, ?, ?, ?)', 
                   (i, f"Mesa {i}", 4, 0))

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