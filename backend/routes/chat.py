from fastapi import APIRouter
from pydantic import BaseModel

from agents.graph import crm_agent


router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)



class ChatRequest(BaseModel):

    message: str



class ChatResponse(BaseModel):

    response: str



@router.post(
    "/",
    response_model=ChatResponse
)
def chat_with_agent(
    request: ChatRequest
):

    result = crm_agent.invoke(

        {

            "message":
            request.message,


            "intent":
            None,


            "tool_result":
            None,


            "response":
            None

        }

    )


    return {

        "response":
        result["response"]

    }