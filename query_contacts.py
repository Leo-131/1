import sqlite3
import json

db_path = r'D:\xwechat_files\wxid_0dj268fwl03v22_38f7\db_storage\contact\contact.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("=== TABLES ===")
for t in tables:
    print(t)

# For each table, show columns
for t in tables:
    cursor.execute(f"PRAGMA table_info({t})")
    cols = cursor.fetchall()
    print(f"\n=== {t} COLUMNS ===")
    for c in cols:
        print(c)

conn.close()
