from typing import Any


def response_builder_node(state: dict) -> dict:
    """
    Builds the final response shown to the user.

    Every tool only returns structured data.

    This node converts that data into
    human readable text.
    """

    intent = state.get("intent")

    tool_result = state.get(
        "tool_output",
        {}
    ).get(
        "tool_result",
        {}
    )

    # -----------------------------
    # Tool Error
    # -----------------------------

    if tool_result.get("status") == "error":

        state["final_response"] = tool_result.get(
            "message",
            "Unknown error occurred."
        )

        return state

    # -----------------------------
    # SEARCH HCP
    # -----------------------------

    if intent == "SEARCH_HCP":

        doctors = tool_result.get(
            "hcp",
            []
        )

        if not doctors:

            state["final_response"] = (
                "No matching HCP found."
            )

            return state

        response = "Matching HCPs\n\n"

        for doctor in doctors:

            response += (
                f"Name: {doctor['name']}\n"
                f"Specialization: {doctor['specialization']}\n"
                f"Hospital: {doctor['hospital']}\n\n"
            )

        state["final_response"] = response

        return state

    # -----------------------------
    # LOG INTERACTION
    # -----------------------------

    if intent == "LOG_INTERACTION":

        state["final_response"] = (

            "Interaction logged successfully.\n\n"

            f"HCP : {tool_result.get('hcp_name')}\n"

            f"Product : {tool_result.get('product')}\n"

            f"Follow Up : {tool_result.get('follow_up')}\n\n"

            f"Summary\n"

            f"{tool_result.get('summary')}"

        )

        return state

    # -----------------------------
    # EDIT
    # -----------------------------

    if intent == "EDIT_INTERACTION":

        state["final_response"] = (

            "Interaction updated successfully.\n\n"

            f"{tool_result.get('summary')}"

        )

        return state

    # -----------------------------
    # NEXT BEST ACTION
    # -----------------------------

    if intent == "NEXT_BEST_ACTION":

        state["final_response"] = (

            "Next Best Action\n\n"

            f"{tool_result.get('recommendation')}"

        )

        return state

    # -----------------------------
    # FOLLOW UP
    # -----------------------------

    if intent == "FOLLOW_UP":

        state["final_response"] = (

            "Follow-up scheduled successfully.\n\n"

            f"HCP : {tool_result.get('hcp_name')}\n"

            f"Date : {tool_result.get('follow_up')}"

        )

        return state

    state["final_response"] = "Completed."

    return state