from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

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

    interactions = relationship(
        "Interaction",
        back_populates="hcp_rel",
        foreign_keys="Interaction.hcp_name",
        primaryjoin="HCP.name == Interaction.hcp_name",
        lazy="dynamic"
    )


class Interaction(Base):

    __tablename__ = "interaction"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hcp_name = Column(
        String,
        nullable=False
    )

    specialization = Column(
        String,
        nullable=True
    )

    hospital = Column(
        String,
        nullable=True
    )

    interaction_date = Column(
        Date,
        nullable=True
    )

    interaction_type = Column(
        String,
        nullable=True
    )

    summary = Column(
        Text
    )

    product = Column(
        String
    )

    outcome = Column(
        String,
        nullable=True
    )

    follow_up = Column(
        Date
    )

    notes = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    hcp_rel = relationship(
        "HCP",
        back_populates="interactions",
        foreign_keys=[hcp_name],
        primaryjoin="HCP.name == Interaction.hcp_name"
    )


# Create tables
Base.metadata.create_all(
    bind=engine
)