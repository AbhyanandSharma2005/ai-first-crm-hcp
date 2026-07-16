from http import HTTPStatus

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database import get_db
from models import Interaction
from schemas import InteractionCreate
from schemas import APIResponse

router = APIRouter(
    prefix="/interaction",
    tags=["Interaction"]
)


# ============================================================
# Response Data
# ============================================================

class InteractionResponseData(BaseModel):

    id: int

    hcp_name: str

    summary: str

    product: str

    follow_up: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# Create Interaction
# ============================================================

@router.post(
    "/",
    status_code=HTTPStatus.CREATED,
    response_model=APIResponse[InteractionResponseData],
    summary="Create Interaction",
    description="Create and store a new HCP interaction.",
    responses={
        201: {
            "description": "Interaction created successfully"
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

        return APIResponse[InteractionResponseData](

            success=True,

            message="Interaction created successfully.",

            data=new_interaction,

            error=None

        )

    except Exception as e:

        db.rollback()

        return APIResponse[InteractionResponseData](

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
    response_model=APIResponse[list[InteractionResponseData]],
    summary="Get All Interactions",
    description="Retrieve all stored HCP interactions.",
    responses={
        200: {
            "description": "Interactions retrieved successfully"
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

            .order_by(
                Interaction.id.desc()
            )

            .all()

        )

        return APIResponse[list[InteractionResponseData]](

            success=True,

            message="Interactions retrieved successfully.",

            data=interactions,

            error=None

        )

    except Exception as e:

        return APIResponse[list[InteractionResponseData]](

            success=False,

            message="Failed to retrieve interactions.",

            data=[],

            error=str(e)

        )