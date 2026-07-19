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

from utils.logger import logger
from websocket_manager import manager


router = APIRouter(
    prefix="/interaction",
    tags=["Interaction"]
)


# ============================================================
# Create Interaction
# ============================================================

@router.post(
    "/",
    operation_id="createInteraction",
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
                            "interaction_id": 1,
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

    logger.info(
        f"Creating interaction for HCP: {interaction.hcp_name}"
    )

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

        logger.info(
            f"Interaction created successfully. ID={new_interaction.id}"
        )

        # Broadcast dashboard update to all connected WebSocket clients
        import asyncio
        asyncio.create_task(
            manager.broadcast({
                "event": "dashboard_updated",
                "type": "interaction_created",
                "interaction_id": new_interaction.id,
                "message": "New interaction created"
            })
        )

        return APIResponse[InteractionResponse](

            success=True,

            message="Interaction created successfully.",

            data=new_interaction,

            error=None

        )

    except Exception as e:

        db.rollback()

        logger.exception(
            "Failed to create interaction."
        )

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
    operation_id="getAllInteractions",
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
                                "interaction_id": 1,
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

    logger.info("Fetching all interactions.")

    try:

        interactions = (

            db.query(Interaction)

            .order_by(
                Interaction.id.desc()
            )

            .all()

        )

        logger.info(
            f"Retrieved {len(interactions)} interactions."
        )

        return APIResponse[list[InteractionResponse]](

            success=True,

            message="Interactions retrieved successfully.",

            data=interactions,

            error=None

        )

    except Exception as e:

        logger.exception(
            "Failed to retrieve interactions."
        )

        return APIResponse[list[InteractionResponse]](

            success=False,

            message="Failed to retrieve interactions.",

            data=[],

            error=str(e)

        )


# ============================================================
# Delete Interaction
# ============================================================

@router.delete(
    "/{interaction_id}",
    operation_id="deleteInteraction",
    response_model=APIResponse[dict],
    summary="Delete Interaction",
    description="Delete an existing interaction by ID.",
    responses={
        200: {
            "description": "Interaction deleted successfully"
        },
        404: {
            "description": "Interaction not found"
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):

    logger.info(f"Deleting interaction with ID: {interaction_id}")

    try:

        interaction = (

            db.query(Interaction)

            .filter(Interaction.id == interaction_id)

            .first()

        )

        if not interaction:

            logger.warning(f"Interaction {interaction_id} not found.")

            return APIResponse[dict](

                success=False,

                message="Interaction not found.",

                data=None,

                error="Interaction does not exist"

            )

        db.delete(interaction)

        db.commit()

        logger.info(f"Interaction {interaction_id} deleted successfully.")

        # Broadcast dashboard update to all connected WebSocket clients
        import asyncio
        asyncio.create_task(
            manager.broadcast({
                "event": "dashboard_updated",
                "type": "interaction_deleted",
                "interaction_id": interaction_id,
                "message": "Interaction deleted"
            })
        )

        return APIResponse[dict](

            success=True,

            message="Interaction deleted successfully.",

            data={"deleted_id": interaction_id},

            error=None

        )

    except Exception as e:

        db.rollback()

        logger.exception(f"Failed to delete interaction {interaction_id}.")

        return APIResponse[dict](

            success=False,

            message="Failed to delete interaction.",

            data=None,

            error=str(e)

        )


# ============================================================
# Update Interaction
# ============================================================

@router.put(
    "/{interaction_id}",
    operation_id="updateInteraction",
    response_model=APIResponse[InteractionResponse],
    summary="Update Interaction",
    description="Update an existing interaction by ID.",
    responses={
        200: {
            "description": "Interaction updated successfully"
        },
        404: {
            "description": "Interaction not found"
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def update_interaction(
    interaction_id: int,
    interaction_data: InteractionCreate,
    db: Session = Depends(get_db)
):

    logger.info(f"Updating interaction with ID: {interaction_id}")

    try:

        interaction = (

            db.query(Interaction)

            .filter(Interaction.id == interaction_id)

            .first()

        )

        if not interaction:

            logger.warning(f"Interaction {interaction_id} not found.")

            return APIResponse[InteractionResponse](

                success=False,

                message="Interaction not found.",

                data=None,

                error="Interaction does not exist"

            )

        # Update fields
        interaction.hcp_name = interaction_data.hcp_name
        interaction.summary = interaction_data.summary
        interaction.product = interaction_data.product
        interaction.follow_up = interaction_data.follow_up

        db.commit()

        db.refresh(interaction)

        logger.info(f"Interaction {interaction_id} updated successfully.")

        # Broadcast dashboard update to all connected WebSocket clients
        import asyncio
        asyncio.create_task(
            manager.broadcast({
                "event": "dashboard_updated",
                "type": "interaction_updated",
                "interaction_id": interaction_id,
                "message": "Interaction updated"
            })
        )

        return APIResponse[InteractionResponse](

            success=True,

            message="Interaction updated successfully.",

            data=interaction,

            error=None

        )

    except Exception as e:

        db.rollback()

        logger.exception(f"Failed to update interaction {interaction_id}.")

        return APIResponse[InteractionResponse](

            success=False,

            message="Failed to update interaction.",

            data=None,

            error=str(e)

        )