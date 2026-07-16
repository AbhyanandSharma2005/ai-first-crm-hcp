from fastapi import APIRouter
from pydantic import BaseModel, Field

from graph import graph
from schemas import APIResponse

router = APIRouter(
    prefix="/edit",
    tags=["Edit Interaction"]
)


# ============================================================
# Request Model
# ============================================================

class EditRequest(BaseModel):

    session_id: str = Field(
        ...,
        description="Session ID"
    )

    message: str = Field(
        ...,
        description="Edit instruction"
    )


# ============================================================
# Response Model
# ============================================================

class EditResponse(BaseModel):

    interaction_id: int | None = None

    response: str


# ============================================================
# Endpoint
# ============================================================

@router.put(
    "/",
    response_model=APIResponse[EditResponse],
    summary="Edit Existing Interaction"
)
def edit_interaction(request: EditRequest):

    state = {

        "session_id": request.session_id,

        "user_message": request.message,

        "intent": "EDIT_INTERACTION",

        "tool_output": {},

        "final_response": "",

        "sources": [],

        "scores": [],

        "error": None

    }

    try:

        result = graph.invoke(state)

        return APIResponse[EditResponse](

            success=True,

            message="Interaction updated successfully.",

            data=EditResponse(

                interaction_id=result.get(
                    "interaction_id"
                ),

                response=result.get(
                    "final_response",
                    ""
                )

            ),

            error=None

        )

    except Exception as e:

        return APIResponse[EditResponse](

            success=False,

            message="Failed to update interaction.",

            data=None,

            error=str(e)

        )