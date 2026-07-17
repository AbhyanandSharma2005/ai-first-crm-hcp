from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import (
    extract,
    func
)
from database import get_db
from models import (
    HCP,
    Interaction
)
from schemas import (
    APIResponse,
    DashboardStats,
    MonthlyInteraction,
    MonthlyInteractionResponse
)
from utils.logger import logger
from typing import Optional
from fastapi import Query



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
    product: Optional[str] = Query(None),
    doctor: Optional[str] = Query(None),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):

    logger.info("Fetching dashboard statistics.")

    try:

        # =====================================================
        # Total HCPs
        # =====================================================

        total_hcps = db.query(HCP).count()

        # =====================================================
        # Build Query
        # =====================================================

        query = db.query(Interaction)

        if product:
            query = query.filter(
                Interaction.product == product
            )

        if doctor:
            query = query.filter(
                Interaction.hcp_name == doctor
            )

        if month:
            query = query.filter(
                extract("month", Interaction.follow_up) == month
            )

        # =====================================================
        # Fetch Interactions
        # =====================================================

        interactions = query.all()

        total_interactions = len(interactions)

        # =====================================================
        # Product Distribution
        # =====================================================

        product_counter = Counter()

        for interaction in interactions:

            product_name = (
                interaction.product
                if interaction.product
                else "Unknown"
            )

            product_counter[product_name] += 1

        # =====================================================
        # Recent Interactions
        # =====================================================

        recent_interactions = (
            query
            .order_by(Interaction.id.desc())
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

# ==========================================================
# Monthly Interaction Trend
# ==========================================================

@router.get(

    "/monthly",

    operation_id="getMonthlyInteractionTrend",

    response_model=APIResponse[MonthlyInteractionResponse],

    summary="Monthly Interaction Trend",

    description="Returns monthly interaction counts grouped by follow-up month.",

    responses={

        200: {

            "description": "Monthly interaction trend retrieved successfully."

        },

        500: {

            "description": "Internal server error."

        }

    }

)
def monthly_interactions(

    db: Session = Depends(get_db)

):

    logger.info(

        "Fetching monthly interaction trend."

    )

    try:

        months = [

            "Jan",

            "Feb",

            "Mar",

            "Apr",

            "May",

            "Jun",

            "Jul",

            "Aug",

            "Sep",

            "Oct",

            "Nov",

            "Dec"

        ]

        result = (

            db.query(

                extract(

                    "month",

                    Interaction.follow_up

                ).label("month"),

                func.count(

                    Interaction.id

                ).label("count")

            )

            .filter(

                Interaction.follow_up.isnot(None)

            )

            .group_by(

                extract(

                    "month",

                    Interaction.follow_up

                )

            )

            .order_by(

                extract(

                    "month",

                    Interaction.follow_up

                )

            )

            .all()

        )

        monthly_data = []

        for month, count in result:

            monthly_data.append(

                MonthlyInteraction(

                    month=months[int(month) - 1],

                    count=count

                )

            )

        logger.info(

            "Monthly interaction trend fetched successfully."

        )

        return APIResponse[MonthlyInteractionResponse](

            success=True,

            message="Monthly interaction trend retrieved successfully.",

            data=MonthlyInteractionResponse(

                monthly_data=monthly_data

            ),

            error=None

        )

    except Exception as e:

        logger.exception(

            "Failed to fetch monthly interaction trend."

        )

        return APIResponse[MonthlyInteractionResponse](

            success=False,

            message="Failed to retrieve monthly interaction trend.",

            data=None,

            error=str(e)

        )