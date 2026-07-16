from fastapi import APIRouter
from pydantic import BaseModel, Field, ConfigDict

from graph import graph
from services.session_memory import session_memory
from schemas import APIResponse

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


# ============================================================
# Request Model
# ============================================================

class ChatRequest(BaseModel):

    session_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Unique session identifier"
    )

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="User message"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "session_id": "abc123",
                "message": "What does the CardioX clinical study say?"
            }
        }
    )


# ============================================================
# Response Data
# ============================================================

class ChatData(BaseModel):

    intent: str = Field(
        description="Detected intent"
    )

    response: str = Field(
        description="Assistant response"
    )

    rewritten_query: str = Field(
        default="",
        description="Query after rewriting"
    )

    sources: list[str] = Field(
        default_factory=list,
        description="Retrieved document sources"
    )

    scores: list[float | None] = Field(
        default_factory=list,
        description="Similarity scores"
    )


# ============================================================
# Chat Endpoint
# ============================================================

@router.post(
    "/",
    response_model=APIResponse[ChatData],
    summary="Chat with AI CRM Assistant",
    description="""
Interact with the AI CRM assistant.

Supported capabilities:

• Intent Detection

• Log Interaction

• Edit Interaction

• Search HCP

• Next Best Action

• Follow-up Scheduling

• Conversation Memory

• Retrieval-Augmented Generation (RAG)

• Document Question Answering

• Citation Support
""",
    responses={
        200: {
            "description": "Request completed successfully"
        },
        400: {
            "description": "Invalid request"
        },
        422: {
            "description": "Validation error"
        },
        500: {
            "description": "Internal server error"
        }
    }
)
def chat_with_agent(request: ChatRequest):

    # --------------------------------------------------------
    # Empty message validation
    # --------------------------------------------------------

    if not request.message.strip():

        return APIResponse[ChatData](

            success=False,

            message="Message cannot be empty.",

            data=ChatData(

                intent="CHAT",

                response="Please enter a message.",

                rewritten_query="",

                sources=[],

                scores=[]

            ),

            error="Empty message"

        )

    # --------------------------------------------------------
    # Load previous session
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

    try:

        print("\n========== MEMORY ==========")

        print(
            session_memory.get_value(
                request.session_id,
                "last_hcp"
            )
        )

        print("============================")

        result = graph.invoke(state)

    except Exception as e:

        return APIResponse[ChatData](

            success=False,

            message="Request failed.",

            data=None,

            error=str(e)

        )

    # --------------------------------------------------------
    # Save latest session
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

    return APIResponse[ChatData](

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