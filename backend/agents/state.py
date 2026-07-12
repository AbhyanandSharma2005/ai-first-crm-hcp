from typing import TypedDict, Optional, Any


class AgentState(TypedDict):
    """
    Shared state used by every LangGraph node.

    Every node receives this state and
    returns an updated version.
    """

    # -------------------------------------------------
    # Session
    # -------------------------------------------------

    session_id: str

    # -------------------------------------------------
    # User Message
    # -------------------------------------------------

    user_message: str

    # -------------------------------------------------
    # Intent
    # -------------------------------------------------

    intent: str

    # -------------------------------------------------
    # Tool Output
    # -------------------------------------------------

    tool_output: dict[str, Any]

    # -------------------------------------------------
    # Final Response
    # -------------------------------------------------

    final_response: str

    # -------------------------------------------------
    # Interaction Information
    # -------------------------------------------------

    interaction_id: Optional[int]

    hcp_name: Optional[str]

    summary: Optional[str]

    product: Optional[str]

    follow_up: Optional[str]

    # -------------------------------------------------
    # Error
    # -------------------------------------------------

    error: Optional[str]