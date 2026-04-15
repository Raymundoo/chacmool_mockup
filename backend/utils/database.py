from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'evalpro_db')

client = None
db = None

async def get_db():
    """Get database instance"""
    global client, db
    if db is None:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
    return db

async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
