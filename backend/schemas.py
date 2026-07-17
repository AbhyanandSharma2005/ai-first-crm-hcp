from datetime import date
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field


# ==========================================================
# Generic API Response
# ==========================================================

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standard response returned by every API endpoint.
    """

    success: bool

    message: str

    data: Optional[T] = None

    error: Optional[str] = None


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

    specialization: Optional[str] = Field(
        default=None,
        description="Medical specialization",
        examples=["Cardiology"]
    )

    hospital: Optional[str] = Field(
        default=None,
        description="Hospital name",
        examples=["Apollo Hospital"]
    )


class HCPCreate(HCPBase):

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Dr Sharma",
                "specialization": "Cardiology",
                "hospital": "Apollo Hospital"
            }
        }
    )


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

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "hcp_name": "Dr Sharma",
                "summary": "Discussed CardioX efficacy study",
                "product": "CardioX",
                "follow_up": "2026-08-15"
            }
        }
    )


class InteractionUpdate(BaseModel):

    hcp_name: Optional[str] = None

    summary: Optional[str] = None

    product: Optional[str] = None

    follow_up: Optional[date] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "summary": "Doctor requested latest clinical study.",
                "product": "CardioX",
                "follow_up": "2026-08-20"
            }
        }
    )


class InteractionResponse(InteractionBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )

# ==========================================================
# DASHBOARD SCHEMAS
# ==========================================================

class DashboardStats(BaseModel):

    total_hcps: int

    total_interactions: int

    products: dict[str, int]

    recent_interactions: list[InteractionResponse]

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
        description="AI generated response",
        examples=[
            "CardioX significantly reduced blood pressure in the Phase III clinical trial."
        ]
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

    doctor_name: str = Field(
        description="Doctor name extracted by the LLM",
        examples=["Dr Sharma"]
    )

    product: str = Field(
        description="Product extracted by the LLM",
        examples=["CardioX"]
    )

    summary: str = Field(
        description="Interaction summary extracted by the LLM",
        examples=[
            "Doctor requested the latest clinical study."
        ]
    )

    follow_up: str = Field(
        description="Follow-up date extracted by the LLM",
        examples=["2026-08-15"]
    )


# ==========================================================
# NEXT BEST ACTION
# ==========================================================

class NextBestActionResponse(BaseModel):

    recommendation: str = Field(
        description="AI-generated recommendation",
        examples=[
            "Schedule a follow-up visit with Dr Sharma next week."
        ]
    )


# ==========================================================
# FOLLOW-UP
# ==========================================================

class FollowUpRequest(BaseModel):

    interaction_id: int = Field(
        description="Interaction ID",
        examples=[15]
    )

    follow_up_date: date = Field(
        description="Next follow-up date",
        examples=["2026-08-15"]
    )


# ==========================================================
# EDIT INTERACTION
# ==========================================================

class EditInteractionRequest(BaseModel):

    interaction_id: int = Field(
        description="Interaction ID",
        examples=[15]
    )

    summary: Optional[str] = Field(
        default=None,
        description="Updated interaction summary",
        examples=[
            "Doctor requested the latest brochure."
        ]
    )

    product: Optional[str] = Field(
        default=None,
        description="Updated product",
        examples=["CardioX"]
    )

    follow_up: Optional[date] = Field(
        default=None,
        description="Updated follow-up date",
        examples=["2026-08-25"]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "interaction_id": 15,
                "summary": "Doctor requested the latest brochure.",
                "product": "CardioX",
                "follow_up": "2026-08-25"
            }
        }
    )
    
