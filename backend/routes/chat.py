from fastapi import APIRouter
from pydantic import BaseModel, Field

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

    session_id: str = Field(
        min_length=1,
        max_length=100,
        description="Unique session identifier"
    )

    message: str = Field(
        min_length=1,
        max_length=4000,
        description="User message"
    )


# ============================================================
# Response Data Model
# ============================================================

class ChatData(BaseModel):

    intent: str

    response: str

    rewritten_query: str = ""

    sources: list[str] = []

    scores: list[float | None] = []


# ============================================================
# Standard API Response
# ============================================================

class ChatResponse(BaseModel):

    success: bool

    message: str

    data: ChatData | None

    error: str | None = None


# ============================================================
# Chat Endpoint
# ============================================================

@router.post(
    "/",
    response_model=ChatResponse,
    summary="Chat with AI CRM Agent",
    description="""
Interact with the AI CRM assistant.

The assistant automatically:

• Detects user intent

• Executes LangGraph tools

• Uses Conversation Memory

• Retrieves documents using RAG

• Returns cited answers

• Generates grounded responses
"""
)
def chat_with_agent(request: ChatRequest):

    # --------------------------------------------------------
    # Load previous AgentState
    # --------------------------------------------------------

    state = session_memory.get(
        request.session_id
    )

    # --------------------------------------------------------
    # First message
    # --------------------------------------------------------

    if state is None:

        state = {

            "session_id": request.session_id,

            "conversation": {},

            "user_message": request.message,

            "intent": "",

            "tool_output": {},

            "final_response": "",

            "rewritten_query": "",

            "sources": [],

            "scores": [],

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
    # Existing Session
    # --------------------------------------------------------

    else:

        state["session_id"] = request.session_id

        state["user_message"] = request.message

        state["tool_output"] = {}

        state["final_response"] = ""

        state["rewritten_query"] = ""

        state["sources"] = []

        state["scores"] = []

        state["error"] = None

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

    result = graph.invoke(
        state
    )

    # --------------------------------------------------------
    # Save Updated State
    # --------------------------------------------------------

    print("\n========== FINAL GRAPH RESULT ==========")

    print(result)

    print("========================================")

    session_memory.save(

        request.session_id,

        result

    )

    # --------------------------------------------------------
    # Standard API Response
    # --------------------------------------------------------

    return ChatResponse(

        success=result.get("error") is None,

        message=(

            "Request completed successfully."

            if result.get("error") is None

            else "Request failed."

        ),

        data=ChatData(

            intent=result.get(
                "intent",
                ""
            ),

            response=result.get(
                "final_response",
                ""
            ),

            rewritten_query=result.get(
                "rewritten_query",
                ""
            ),

            sources=result.get(
                "sources",
                []
            ),

            scores=result.get(
                "scores",
                []
            )

        ),

        error=result.get(
            "error"
        )

    )