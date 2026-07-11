from fastapi import APIRouter
from pydantic import BaseModel

from graph import graph


router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    intent: str
    response: str
    error: str | None = None


@router.post(
    "/",
    response_model=ChatResponse
)
def chat_with_agent(request: ChatRequest):

    initial_state = {

        "user_message": request.message,

        "intent": "",

        "tool_output": {},

        "final_response": "",

        "interaction_id": None,

        "hcp_name": None,

        "summary": None,

        "product": None,

        "follow_up": None,

        "error": None

    }

    result = graph.invoke(initial_state)

    return ChatResponse(

        intent=result["intent"],

        response=result["final_response"],

        error=result["error"]

    )