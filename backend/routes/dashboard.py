from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import HCP, Interaction
from schemas import (
    APIResponse,
    DashboardStats
)
from utils.logger import logger


router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"]

)


# ==========================================================
# Dashboard Statistics
# ==========================================================

@router.get(

    "/stats",

    operation_id="getDashboardStats",

    response_model=APIResponse[DashboardStats],

    summary="Dashboard Statistics",

    description="Returns dashboard analytics including HCP count, interaction count, product distribution and recent interactions.",

    responses={

        200: {
            "description": "Dashboard statistics retrieved successfully."
        },

        500: {
            "description": "Internal server error."
        }

    }

)
def get_dashboard_stats(

    db: Session = Depends(get_db)

):

    logger.info("Fetching dashboard statistics.")

    try:

        # =====================================================
        # Total HCPs
        # =====================================================

        total_hcps = (

            db.query(HCP)

            .count()

        )

        # =====================================================
        # Total Interactions
        # =====================================================

        total_interactions = (

            db.query(Interaction)

            .count()

        )

        # =====================================================
        # Product Distribution
        # =====================================================

        interactions = (

            db.query(Interaction)

            .all()

        )

        product_counter = Counter()

        for interaction in interactions:

            product = (

                interaction.product

                if interaction.product

                else "Unknown"

            )

            product_counter[product] += 1

        # =====================================================
        # Recent Interactions
        # =====================================================

        recent_interactions = (

            db.query(Interaction)

            .order_by(

                Interaction.id.desc()

            )

            .limit(5)

            .all()

        )

        # =====================================================
        # Response
        # =====================================================

        dashboard = DashboardStats(

            total_hcps=total_hcps,

            total_interactions=total_interactions,

            products=dict(product_counter),

            recent_interactions=recent_interactions

        )

        logger.info("Dashboard statistics fetched successfully.")

        return APIResponse[DashboardStats](

            success=True,

            message="Dashboard statistics retrieved successfully.",

            data=dashboard,

            error=None

        )

    except Exception as e:

        logger.exception("Failed to fetch dashboard statistics.")

        return APIResponse[DashboardStats](

            success=False,

            message="Failed to retrieve dashboard statistics.",

            data=None,

            error=str(e)

        )