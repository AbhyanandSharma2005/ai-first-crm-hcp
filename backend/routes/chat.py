from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def chat(request: ChatRequest):
    """
    Temporary AI chat endpoint.
    Later this will call LangGraph + Groq.
    """
    return {
        "reply": f"AI received: {request.message}"
    }