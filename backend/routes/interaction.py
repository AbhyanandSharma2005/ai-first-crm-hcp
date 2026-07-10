from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from database import get_db

from models import Interaction

from schemas import InteractionCreate


router = APIRouter(
    prefix="/interaction",
    tags=["Interaction"]
)



@router.post("/")
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):

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



@router.get("/")
def get_interactions(
    db: Session = Depends(get_db)
):

    interactions = db.query(
        Interaction
    ).all()


    return interactions