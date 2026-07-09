from sqlalchemy.orm import Session
from fastapi import HTTPException

from models import Interaction
from schemas import InteractionCreate, InteractionUpdate


class InteractionService:
    """
    Service layer responsible for all Interaction database operations.
    """

    @staticmethod
    def create_interaction(
        db: Session,
        interaction: InteractionCreate
    ):
        """
        Create a new interaction.
        """

        new_interaction = Interaction(
            hcp_name=interaction.hcp_name,
            summary=interaction.summary,
            product=interaction.product,
            follow_up=interaction.follow_up
        )

        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)

        return new_interaction

    @staticmethod
    def get_all_interactions(db: Session):
        """
        Fetch all interactions ordered by newest first.
        """

        return (
            db.query(Interaction)
            .order_by(Interaction.id.desc())
            .all()
        )

    @staticmethod
    def get_interaction_by_id(
        db: Session,
        interaction_id: int
    ):
        """
        Fetch a single interaction.
        """

        interaction = (
            db.query(Interaction)
            .filter(Interaction.id == interaction_id)
            .first()
        )

        if interaction is None:
            raise HTTPException(
                status_code=404,
                detail="Interaction not found."
            )

        return interaction

    @staticmethod
    def update_interaction(
        db: Session,
        interaction_id: int,
        interaction_data: InteractionUpdate
    ):
        """
        Update an existing interaction.
        """

        interaction = (
            db.query(Interaction)
            .filter(Interaction.id == interaction_id)
            .first()
        )

        if interaction is None:
            raise HTTPException(
                status_code=404,
                detail="Interaction not found."
            )

        update_fields = interaction_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_fields.items():
            setattr(interaction, key, value)

        db.commit()
        db.refresh(interaction)

        return interaction

    @staticmethod
    def delete_interaction(
        db: Session,
        interaction_id: int
    ):
        """
        Delete an interaction.
        """

        interaction = (
            db.query(Interaction)
            .filter(Interaction.id == interaction_id)
            .first()
        )

        if interaction is None:
            raise HTTPException(
                status_code=404,
                detail="Interaction not found."
            )

        db.delete(interaction)
        db.commit()

        return {
            "message": "Interaction deleted successfully."
        }