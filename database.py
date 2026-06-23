from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)

db = client.task_manager

users_collection = db.users
projects_collection = db.projects
tasks_collection = db.tasks