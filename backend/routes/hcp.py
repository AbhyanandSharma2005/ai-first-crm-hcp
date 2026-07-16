from fastapi import APIRouter
from pydantic import BaseModel, Field

from graph import graph
from schemas import APIResponse
from utils.logger import logger


router = APIRouter(
    prefix="/hcp",
    tags=["HCP Search"]
)


# ============================================================
# Request
# ============================================================

class HCPRequest(BaseModel):

    session_id: str = Field(
        ...,
        description="Unique session identifier",
        examples=["abc123"]
    )

    doctor_name: str = Field(
        ...,
        description="Doctor name to search",
        examples=["Dr Sharma"]
    )


# ============================================================
# Response
# ============================================================

class HCPResponse(BaseModel):

    response: str = Field(
        description="Search result"
    )


# ============================================================
# Endpoint
# ============================================================

@router.get(
    "/search",
    operation_id="searchHCP",
    response_model=APIResponse[HCPResponse],
    summary="Search HCP",
    description="Search Healthcare Professionals using the AI agent.",
    responses={
        200: {
            "description": "HCP retrieved successfully"
        },
        400: {
            "description": "Invalid request"
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def search_hcp(request: HCPRequest):

    logger.info(
        f"Searching HCP: {request.doctor_name}"
    )

    state = {

        "session_id": request.session_id,

        "user_message": request.doctor_name,

        "intent": "SEARCH_HCP",

        "tool_output": {},

        "final_response": "",

        "sources": [],

        "scores": [],

        "error": None

    }

    try:

        result = graph.invoke(state)

        logger.info(
            f"HCP search completed for: {request.doctor_name}"
        )

        return APIResponse[HCPResponse](

            success=True,

            message="HCP retrieved successfully.",

            data=HCPResponse(

                response=result.get(
                    "final_response",
                    ""
                )

            ),

            error=None

        )

    except Exception as e:

        logger.exception(
            f"Failed to search HCP: {request.doctor_name}"
        )

        return APIResponse[HCPResponse](

            success=False,

            message="Failed to search HCP.",

            data=None,

            error=str(e)

        )