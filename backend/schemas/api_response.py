from typing import Any

from pydantic import BaseModel


class APIResponse(BaseModel):
    """
    Standard response format
    used by every API.
    """

    success: bool

    message: str

    data: Any = None

    error: str | None = None