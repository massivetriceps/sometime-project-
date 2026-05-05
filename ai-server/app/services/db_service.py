"""
DB 연결 모듈
"""

import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    """DB 커넥션 반환"""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset="utf8mb4",
    )