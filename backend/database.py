from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import DATABASE_URL


# Create database engine
engine = create_engine(
    DATABASE_URL
)


# Create database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Dependency for FastAPI routes
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()