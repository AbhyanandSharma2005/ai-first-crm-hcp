from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import InteractionCreate

router = APIRouter(
    prefix="/interactions",
    tags=["Interactions"]
)


@router.get("/")
def get_all_interactions(db: Session = Depends(get_db)):
    """
    Get all logged HCP interactions.
    """
    return {
        "message": "Fetch all interactions",
        "data": []
    }


@router.post("/")
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):
    """
    Save a new HCP interaction.
    """
    return {
        "message": "Interaction received successfully",
        "interaction": interaction.model_dump()
    }