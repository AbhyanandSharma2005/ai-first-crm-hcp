from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Interaction
from schemas import (
    APIResponse,
    InteractionCreate,
    InteractionResponse
)

router = APIRouter(
    prefix="/interaction",
    tags=["Interaction"]
)


# ============================================================
# Create Interaction
# ============================================================

@router.post(
    "/",
    status_code=HTTPStatus.CREATED,
    response_model=APIResponse[InteractionResponse],
    summary="Create Interaction",
    description="Create and store a new HCP interaction.",
    responses={
        201: {
            "description": "Interaction created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Interaction created successfully.",
                        "data": {
                            "id": 1,
                            "hcp_name": "Dr Sharma",
                            "summary": "Discussed CardioX efficacy study.",
                            "product": "CardioX",
                            "follow_up": "2026-08-15"
                        },
                        "error": None
                    }
                }
            }
        },
        400: {
            "description": "Invalid request"
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):

    try:

        new_interaction = Interaction(
            hcp_name=interaction.hcp_name,
            summary=interaction.summary,
            product=interaction.product,
            follow_up=interaction.follow_up
        )

        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)

        return APIResponse[InteractionResponse](
            success=True,
            message="Interaction created successfully.",
            data=new_interaction,
            error=None
        )

    except Exception as e:

        db.rollback()

        return APIResponse[InteractionResponse](
            success=False,
            message="Failed to create interaction.",
            data=None,
            error=str(e)
        )


# ============================================================
# Get All Interactions
# ============================================================

@router.get(
    "/",
    response_model=APIResponse[list[InteractionResponse]],
    summary="Get All Interactions",
    description="Retrieve all stored HCP interactions.",
    responses={
        200: {
            "description": "Interactions retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Interactions retrieved successfully.",
                        "data": [
                            {
                                "id": 1,
                                "hcp_name": "Dr Sharma",
                                "summary": "Discussed CardioX efficacy study.",
                                "product": "CardioX",
                                "follow_up": "2026-08-15"
                            }
                        ],
                        "error": None
                    }
                }
            }
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def get_interactions(
    db: Session = Depends(get_db)
):

    try:

        interactions = (
            db.query(Interaction)
            .order_by(Interaction.id.desc())
            .all()
        )

        return APIResponse[list[InteractionResponse]](
            success=True,
            message="Interactions retrieved successfully.",
            data=interactions,
            error=None
        )

    except Exception as e:

        return APIResponse[list[InteractionResponse]](
            success=False,
            message="Failed to retrieve interactions.",
            data=[],
            error=str(e)
        )