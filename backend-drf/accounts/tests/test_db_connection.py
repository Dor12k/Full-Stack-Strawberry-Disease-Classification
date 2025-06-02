
import sys
print(sys.executable)

import psycopg2
import os
import pytest

def test_postgres_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=5432,
        )
        cur = conn.cursor()
        cur.execute('SELECT 1;')
        result = cur.fetchone()
        assert result == (1,)
    finally:
        if conn:
            conn.close()
