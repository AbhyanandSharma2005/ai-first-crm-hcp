from fastapi import APIRouter
from pydantic import BaseModel, Field

from graph import graph
from schemas import APIResponse

router = APIRouter(
    prefix="/hcp",
    tags=["HCP Search"]
)


# ============================================================
# Request
# ============================================================

class HCPRequest(BaseModel):

    session_id: str = Field(...)

    doctor_name: str = Field(...)


# ============================================================
# Response
# ============================================================

class HCPResponse(BaseModel):

    response: str


# ============================================================
# Endpoint
# ============================================================

@router.get(
    "/search",
    operation_id="searchHCP",
    response_model=APIResponse[HCPResponse],
    summary="Search HCP"
)
def search_hcp(request: HCPRequest):

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

        return APIResponse[HCPResponse](

            success=False,

            message="Failed to search HCP.",

            data=None,

            error=str(e)

        )