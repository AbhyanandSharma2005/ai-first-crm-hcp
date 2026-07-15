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

    sources: list[str] = []

    error: str | None = None


# ============================================================
# Chat Endpoint
# ============================================================

@router.post(
    "/",
    response_model=ChatResponse
)
def chat_with_agent(request: ChatRequest):

    # --------------------------------------------------------
    # Load previous AgentState for this session
    # --------------------------------------------------------

    state = session_memory.get(request.session_id)

    # --------------------------------------------------------
    # First message of this session
    # --------------------------------------------------------

    if state is None:

        state = {

            "session_id": request.session_id,

            "conversation": {},

            "user_message": request.message,

            "intent": "",

            "tool_output": {},

            "final_response": "",

            "sources": [],

            "interaction_id": None,

            "hcp_name": session_memory.get_value(
                request.session_id,
                "last_hcp"
            ),

            "summary": session_memory.get_value(
                request.session_id,
                "last_summary"
            ),

            "product": session_memory.get_value(
                request.session_id,
                "last_product"
            ),

            "follow_up": session_memory.get_value(
                request.session_id,
                "last_follow_up"
            ),

            "recommendation": session_memory.get_value(
                request.session_id,
                "last_recommendation"
            ),

            "error": None

        }

    # --------------------------------------------------------
    # Existing conversation
    # --------------------------------------------------------

    else:

        state["session_id"] = request.session_id

        state["user_message"] = request.message

        state["tool_output"] = {}

        state["final_response"] = ""

        state["sources"] = []

        state["error"] = None

        # Refresh important values from memory

        state["hcp_name"] = session_memory.get_value(
            request.session_id,
            "last_hcp"
        )

        state["summary"] = session_memory.get_value(
            request.session_id,
            "last_summary"
        )

        state["product"] = session_memory.get_value(
            request.session_id,
            "last_product"
        )

        state["follow_up"] = session_memory.get_value(
            request.session_id,
            "last_follow_up"
        )

        state["recommendation"] = session_memory.get_value(
            request.session_id,
            "last_recommendation"
        )

    # --------------------------------------------------------
    # Execute LangGraph
    # --------------------------------------------------------

    print("\n========== MEMORY ==========")

    print(
        session_memory.get_value(
            request.session_id,
            "last_hcp"
        )
    )

    print("============================")

    result = graph.invoke(state)

    # --------------------------------------------------------
    # Save latest AgentState
    # --------------------------------------------------------

    print("\n========== FINAL GRAPH RESULT BEFORE MEMORY SAVE ==========")

    print(result)

    print("==========================================================")

    session_memory.save(
        request.session_id,
        result
    )

    # --------------------------------------------------------
    # Return Response
    # --------------------------------------------------------

    return ChatResponse(

        intent=result["intent"],

        response=result["final_response"],

        sources=result.get("sources", []),

        error=result["error"]

    )