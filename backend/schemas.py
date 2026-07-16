from datetime import date
from typing import Optional, Generic, TypeVar

from pydantic import BaseModel, Field, ConfigDict


# ==========================================================
# Generic API Response
# ==========================================================

T = TypeVar("T")


# ==========================================================
# HCP SCHEMAS
# ==========================================================

class HCPBase(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Doctor name",
        examples=["Dr Sharma"]
    )

    specialization: str = Field(
        ...,
        description="Medical specialization",
        examples=["Cardiology"]
    )

    hospital: str = Field(
        ...,
        description="Hospital name",
        examples=["Apollo Hospital"]
    )


class HCPCreate(HCPBase):
    pass


class HCPResponse(HCPBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# INTERACTION SCHEMAS
# ==========================================================

class InteractionBase(BaseModel):

    hcp_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Healthcare professional name",
        examples=["Dr Sharma"]
    )

    summary: str = Field(
        ...,
        min_length=5,
        description="Interaction summary",
        examples=["Discussed CardioX efficacy study"]
    )

    product: str = Field(
        ...,
        description="Product discussed",
        examples=["CardioX"]
    )

    follow_up: Optional[date] = Field(
        default=None,
        description="Follow-up date",
        examples=["2026-08-15"]
    )


class InteractionCreate(InteractionBase):
    """
    Used while creating a new interaction.
    """
    pass


class InteractionUpdate(BaseModel):

    hcp_name: Optional[str] = Field(
        default=None,
        description="Updated HCP name"
    )

    summary: Optional[str] = Field(
        default=None,
        description="Updated summary"
    )

    product: Optional[str] = Field(
        default=None,
        description="Updated product"
    )

    follow_up: Optional[date] = Field(
        default=None,
        description="Updated follow-up date"
    )


class InteractionResponse(InteractionBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# CHAT SCHEMAS
# ==========================================================

class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="User message sent to AI",
        examples=[
            "What does the CardioX clinical study say?"
        ]
    )


class ChatResponse(BaseModel):

    response: str = Field(
        ...,
        description="AI generated response"
    )


# ==========================================================
# LANGGRAPH STATE
# ==========================================================

class AgentState(BaseModel):

    user_input: str

    intent: Optional[str] = None

    extracted_entities: Optional[dict] = None

    tool_name: Optional[str] = None

    tool_output: Optional[dict] = None

    final_response: Optional[str] = None


# ==========================================================
# LLM EXTRACTION SCHEMA
# ==========================================================

class ExtractedInteraction(BaseModel):

    doctor_name: str

    product: str

    summary: str

    follow_up: str


# ==========================================================
# NEXT BEST ACTION
# ==========================================================

class NextBestActionResponse(BaseModel):

    recommendation: str


# ==========================================================
# FOLLOW-UP
# ==========================================================

class FollowUpRequest(BaseModel):

    interaction_id: int

    follow_up_date: date


# ==========================================================
# EDIT INTERACTION
# ==========================================================

class EditInteractionRequest(BaseModel):

    interaction_id: int

    summary: Optional[str] = None

    product: Optional[str] = None

    follow_up: Optional[date] = None


# ==========================================================
# STANDARD API RESPONSE
# ==========================================================

class APIResponse(BaseModel, Generic[T]):
    """
    Standard response returned by every API endpoint.
    """

    success: bool

    message: str

    data: Optional[T] = None

    error: Optional[str] = None