from services.conversation_memory import conversation_memory


def conversation_memory_tool(state: dict) -> dict:
    """
    Returns information stored in conversation memory.

    Supported questions:
    - Which product did we discuss?
    - Summarize the last meeting.
    - When is the follow-up?
    - What should I do next?
    - Who is the last HCP?
    """

    session_id = state.get("session_id")

    if not session_id:
        return {
            "tool_result": {
                "status": "error",
                "message": "Session not found."
            }
        }

    text = state["user_message"].lower()

    # ----------------------------
    # Read memory
    # ----------------------------

    last_hcp = conversation_memory.get(
        session_id,
        "last_hcp"
    )

    last_product = conversation_memory.get(
        session_id,
        "last_product"
    )

    last_summary = conversation_memory.get(
        session_id,
        "last_summary"
    )

    last_follow_up = conversation_memory.get(
        session_id,
        "last_follow_up"
    )

    last_recommendation = conversation_memory.get(
        session_id,
        "last_recommendation"
    )

    # ----------------------------
    # Product
    # ----------------------------

    if any(word in text for word in [
        "product",
        "medicine",
        "drug"
    ]):

        if last_product:
            answer = f"The last product discussed was {last_product}."
        else:
            answer = "No product is available in conversation memory."

    # ----------------------------
    # Summary
    # ----------------------------

    elif any(word in text for word in [
        "summary",
        "summarize",
        "meeting"
    ]):

        if last_summary:
            answer = f"Last meeting summary:\n\n{last_summary}"
        else:
            answer = "No meeting summary found."

    # ----------------------------
    # Follow-up
    # ----------------------------

    elif any(word in text for word in [
        "follow",
        "follow-up",
        "follow up",
        "visit"
    ]):

        if last_follow_up:
            answer = (
                f"The current follow-up is scheduled for "
                f"{last_follow_up}."
            )
        else:
            answer = "No follow-up has been scheduled."

    # ----------------------------
    # Recommendation
    # ----------------------------

    elif any(word in text for word in [
        "recommendation",
        "recommend",
        "next action",
        "should i do"
    ]):

        if last_recommendation:
            answer = last_recommendation
        else:
            answer = "No recommendation available."

    # ----------------------------
    # HCP
    # ----------------------------

    else:

        if last_hcp:
            answer = f"The last HCP was {last_hcp}."
        else:
            answer = "No conversation memory found."

    return {

        "tool_result": {

            "status": "success",

            "answer": answer

        }

    }