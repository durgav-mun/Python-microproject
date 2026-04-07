import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/fluid_sim')
client = MongoClient(MONGO_URI)
db = client.get_default_database(default='fluid_sim')

def get_db():
    return db

