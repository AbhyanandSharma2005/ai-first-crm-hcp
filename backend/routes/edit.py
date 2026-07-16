from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Interaction
from schemas import (
    APIResponse,
    InteractionUpdate,
    InteractionResponse
)

from utils.logger import logger


router = APIRouter(

    prefix="/edit",

    tags=["Edit Interaction"]

)


# ============================================================
# Edit Interaction
# ============================================================

@router.put(

    "/{interaction_id}",

    operation_id="editInteraction",

    status_code=HTTPStatus.OK,

    response_model=APIResponse[InteractionResponse],

    summary="Edit Interaction",

    description="Update an existing Healthcare Professional interaction.",

    responses={

        200:{

            "description":"Interaction updated successfully"

        },

        404:{

            "description":"Interaction not found"

        },

        500:{

            "description":"Internal server error"

        }

    }

)
def edit_interaction(

    interaction_id: int,

    interaction: InteractionUpdate,

    db: Session = Depends(get_db)

):

    logger.info(
        f"Editing interaction ID={interaction_id}"
    )

    try:

        existing_interaction = (

            db.query(Interaction)

            .filter(
                Interaction.id == interaction_id
            )

            .first()

        )

        if existing_interaction is None:

            logger.warning(
                f"Interaction ID={interaction_id} not found."
            )

            return APIResponse[InteractionResponse](

                success=False,

                message="Interaction not found.",

                data=None,

                error="Interaction not found"

            )

        if interaction.hcp_name is not None:

            existing_interaction.hcp_name = interaction.hcp_name

        if interaction.summary is not None:

            existing_interaction.summary = interaction.summary

        if interaction.product is not None:

            existing_interaction.product = interaction.product

        if interaction.follow_up is not None:

            existing_interaction.follow_up = interaction.follow_up
            
            db.commit()

        db.refresh(existing_interaction)

        logger.info(
            f"Interaction ID={interaction_id} updated successfully."
        )

        return APIResponse[InteractionResponse](

            success=True,

            message="Interaction updated successfully.",

            data=existing_interaction,

            error=None

        )

    except Exception as e:

        db.rollback()

        logger.exception(
            f"Failed to update interaction ID={interaction_id}."
        )

        return APIResponse[InteractionResponse](

            success=False,

            message="Failed to update interaction.",

            data=None,

            error=str(e)

        )