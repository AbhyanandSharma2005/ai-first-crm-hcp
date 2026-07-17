from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import HCP
from schemas import APIResponse, HCPResponse
from utils.logger import logger


router = APIRouter(

    prefix="/hcp",

    tags=["HCP Search"]

)


# ==========================================================
# Search HCP
# ==========================================================

@router.get(

    "/search",

    operation_id="searchHCP",

    response_model=APIResponse[list[HCPResponse]],

    summary="Search Healthcare Professionals",

    description="Search Healthcare Professionals from the database.",

    responses={

        200: {

            "description": "Healthcare Professionals retrieved successfully"

        },

        500: {

            "description": "Internal server error"

        }

    }

)
def search_hcp(

    doctor_name: str = Query(

        ...,

        description="Doctor name to search",

        examples=["Dr Sharma"]

    ),

    db: Session = Depends(get_db)

):

    logger.info(f"Searching HCP: {doctor_name}")

    try:

        doctors = (

            db.query(HCP)

            .filter(

                HCP.name.ilike(f"%{doctor_name}%")

            )

            .all()

        )

        logger.info(

            f"{len(doctors)} doctor(s) found."

        )

        return APIResponse[list[HCPResponse]](

            success=True,

            message=(

                "Healthcare Professionals retrieved successfully."

                if doctors

                else "No Healthcare Professionals found."

            ),

            data=doctors,

            error=None

        )

    except Exception as e:

        logger.exception(

            "Failed to search Healthcare Professional."

        )

        return APIResponse[list[HCPResponse]](

            success=False,

            message="Failed to search Healthcare Professional.",

            data=[],

            error=str(e)

        )