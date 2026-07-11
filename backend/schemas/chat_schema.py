from pydantic import BaseModel


class ChatRequest(BaseModel):

    message: str


class ChatResponse(BaseModel):

    intent: str

    response: str

    error: str | None = None