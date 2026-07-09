from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from schemas import (
    InteractionCreate,
    InteractionUpdate,
    InteractionResponse,
    APIResponse
)

from services.interaction_service import InteractionService


router = APIRouter(
    prefix="/interactions",
    tags=["Interactions"]
)


# -------------------------------------------------------
# CREATE INTERACTION
# -------------------------------------------------------

@router.post(
    "/",
    response_model=InteractionResponse
)
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):

    return InteractionService.create_interaction(
        db,
        interaction
    )


# -------------------------------------------------------
# GET ALL INTERACTIONS
# -------------------------------------------------------

@router.get(
    "/",
    response_model=List[InteractionResponse]
)
def get_all_interactions(
    db: Session = Depends(get_db)
):

    return InteractionService.get_all_interactions(
        db
    )


# -------------------------------------------------------
# GET INTERACTION BY ID
# -------------------------------------------------------

@router.get(
    "/{interaction_id}",
    response_model=InteractionResponse
)
def get_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):

    return InteractionService.get_interaction_by_id(
        db,
        interaction_id
    )


# -------------------------------------------------------
# UPDATE INTERACTION
# -------------------------------------------------------

@router.put(
    "/{interaction_id}",
    response_model=InteractionResponse
)
def update_interaction(
    interaction_id: int,
    interaction: InteractionUpdate,
    db: Session = Depends(get_db)
):

    return InteractionService.update_interaction(
        db,
        interaction_id,
        interaction
    )


# -------------------------------------------------------
# DELETE INTERACTION
# -------------------------------------------------------

@router.delete(
    "/{interaction_id}",
    response_model=APIResponse
)
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):

    InteractionService.delete_interaction(
        db,
        interaction_id
    )

    return APIResponse(
        success=True,
        message="Interaction deleted successfully."
    )