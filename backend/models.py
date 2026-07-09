from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.orm import declarative_base

from database import engine


Base = declarative_base()



class HCP(Base):

    __tablename__ = "hcp"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    specialization = Column(
        String
    )

    hospital = Column(
        String
    )



class Interaction(Base):

    __tablename__ = "interaction"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hcp_name = Column(
        String
    )

    summary = Column(
        Text
    )

    product = Column(
        String
    )

    follow_up = Column(
        Date
    )



# Create tables
Base.metadata.create_all(
    bind=engine
)