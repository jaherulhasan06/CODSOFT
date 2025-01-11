import sqlite3

conn = sqlite3.connect('chat_history.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL,
        message TEXT NOT NULL
    )
''')
conn.commit()
conn.close()

print("Database initialized successfully!")
