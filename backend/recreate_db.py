from database import engine
from models import Base

# Drop all existing tables
print("Dropping tables...")
Base.metadata.drop_all(bind=engine)

# Recreate tables with new schema
print("Creating tables...")
Base.metadata.create_all(bind=engine)

print("Database recreation complete.")
