from collections import Counter
from datetime import date
from fastapi import APIRouter, Depends, Query
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
    DashboardKPI,
    MonthlyInteraction,
    MonthlyInteractionResponse,
    TopDoctor,
    TopDoctorsResponse
)
from utils.logger import logger
from typing import Optional



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


# ==========================================================
# Dashboard KPI
# ==========================================================

@router.get(

    "/kpi",

    response_model=APIResponse[DashboardKPI],

    summary="Dashboard KPI",

    description="Returns key performance indicators including today's followups, completed followups, unique products, and average interactions per HCP.",

    responses={

        200: {

            "description": "Dashboard KPI retrieved successfully."

        },

        500: {

            "description": "Internal server error."

        }

    }

)
def dashboard_kpi(

    db: Session = Depends(get_db)

):

    logger.info("Fetching dashboard KPI.")

    try:

        today = date.today()

        # =====================================================
        # Today's Followups
        # =====================================================

        today_followups = (

            db.query(Interaction)

            .filter(

                func.date(

                    Interaction.follow_up

                ) == today

            )

            .count()

        )

        # =====================================================
        # Completed Followups
        # We assume follow_up < today means completed
        # =====================================================

        completed_followups = (

            db.query(Interaction)

            .filter(

                Interaction.follow_up < today

            )

            .count()

        )

        # =====================================================
        # Unique Products
        # =====================================================

        unique_products = (

            db.query(

                Interaction.product

            )

            .distinct()

            .count()

        )

        # =====================================================
        # Average Interactions/HCP
        # =====================================================

        total_interactions = (

            db.query(Interaction)

            .count()

        )

        total_hcps = (

            db.query(HCP)

            .count()

        )

        average = (

            total_interactions / total_hcps

            if total_hcps

            else 0

        )

        # =====================================================
        # Response
        # =====================================================

        logger.info("Dashboard KPI fetched successfully.")

        return APIResponse[DashboardKPI](

            success=True,

            message="Dashboard KPI retrieved.",

            data=DashboardKPI(

                today_followups=today_followups,

                completed_followups=completed_followups,

                unique_products=unique_products,

                average_interactions_per_hcp=round(

                    average,

                    2

                )

            ),

            error=None

        )

    except Exception as e:

        logger.exception("Failed to fetch dashboard KPI.")

        return APIResponse[DashboardKPI](

            success=False,

            message="Failed to retrieve dashboard KPI.",

            data=None,

            error=str(e)

        )


# ==========================================================
# Top Doctors
# ==========================================================

@router.get(

    "/top-doctors",

    response_model=APIResponse[TopDoctorsResponse],

    summary="Top Doctors",

    description="Returns the top 10 doctors with the most interactions.",

    responses={

        200: {

            "description": "Top doctors retrieved successfully."

        },

        500: {

            "description": "Internal server error."

        }

    }

)
def get_top_doctors(

    db: Session = Depends(get_db)

):

    logger.info("Fetching top doctors.")

    try:

        # =====================================================
        # Query Top Doctors
        # =====================================================

        result = (

            db.query(

                Interaction.hcp_name,

                func.count(Interaction.id)

                    .label("count")

            )

            .group_by(

                Interaction.hcp_name

            )

            .order_by(

                func.count(Interaction.id).desc()

            )

            .limit(10)

            .all()

        )

        # =====================================================
        # Build Response
        # =====================================================

        doctors = [

            TopDoctor(

                doctor=row.hcp_name,

                interactions=row.count

            )

            for row in result

        ]

        # =====================================================
        # Response
        # =====================================================

        logger.info("Top doctors fetched successfully.")

        return APIResponse(

            success=True,

            message="Top doctors fetched.",

            data=TopDoctorsResponse(

                doctors=doctors

            ),

            error=None

        )

    except Exception as e:

        logger.exception("Failed to fetch top doctors.")

        return APIResponse[TopDoctorsResponse](

            success=False,

            message="Failed to retrieve top doctors.",

            data=None,

            error=str(e)

        )