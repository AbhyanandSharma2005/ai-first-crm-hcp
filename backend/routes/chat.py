from fastapi import APIRouter
from pydantic import BaseModel

from graph import graph

from services.session_memory import session_memory


router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


# ============================================================
# Request Model
# ============================================================

class ChatRequest(BaseModel):

    session_id: str

    message: str


# ============================================================
# Response Model
# ============================================================

class ChatResponse(BaseModel):

    intent: str

    response: str

    error: str | None = None


# ============================================================
# Chat Endpoint
# ============================================================

@router.post(
    "/",
    response_model=ChatResponse
)
def chat_with_agent(request: ChatRequest):

    # --------------------------------------------
    # Load previous conversation
    # --------------------------------------------

    previous_state = session_memory.get(
        request.session_id
    )

    # --------------------------------------------
    # First message in this session
    # --------------------------------------------

    if previous_state is None:

        state = {
            "session_id": request.session_id,

            "user_message": request.message,

            "intent": "",

            "tool_output": {},

            "final_response": "",

            "interaction_id": None,

            "hcp_name": None,

            "summary": None,

            "product": None,

            "follow_up": None,

            "error": None,

            "conversation": {
            "last_hcp": None
            }
        }

    # --------------------------------------------
    # Existing conversation
    # --------------------------------------------

    else:

        state = previous_state

        state["user_message"] = request.message

        # Reset values generated per request
        state["tool_output"] = {}

        state["final_response"] = ""

        state["error"] = None

    # --------------------------------------------
    # Execute LangGraph
    # --------------------------------------------

    result = graph.invoke(state)

    # --------------------------------------------
    # Save updated conversation
    # --------------------------------------------

    session_memory.save(
        request.session_id,
        result
    )

    # --------------------------------------------
    # Return API response
    # --------------------------------------------

    return ChatResponse(

        intent=result["intent"],

        response=result["final_response"],

        error=result["error"]

    )