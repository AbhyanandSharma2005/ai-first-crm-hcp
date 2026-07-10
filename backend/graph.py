"""
graph.py

LangGraph Agent for AI-First CRM HCP Module

Flow:
Start
   ↓
Intent Classifier
   ↓
Intent Router
   ↓
Log Interaction Tool
   ↓
END
"""

from typing import TypedDict, Optional, Any

from langgraph.graph import StateGraph, END

from services.intent_classifier import intent_classifier

from tools.log_interaction import log_interaction_tool

from tools.edit_interaction import edit_interaction_tool

# ============================================================
# Agent State
# ============================================================

class AgentState(TypedDict):
    """
    Shared state used by every LangGraph node.
    """

    user_message: str

    intent: str

    tool_output: dict[str, Any]

    final_response: str

    interaction_id: Optional[int]

    hcp_name: Optional[str]

    summary: Optional[str]

    product: Optional[str]

    follow_up: Optional[str]

    error: Optional[str]


# ============================================================
# Start Node
# ============================================================

def start_node(state: AgentState) -> AgentState:
    """
    Entry point of LangGraph.
    """

    try:

        print("\n==============================")
        print("START NODE")
        print("==============================")

        print(f"User Message: {state['user_message']}")
        print("Incoming State:")
        print(state)

        return state

    except Exception as e:
        state["error"] = str(e)
        return state


# ============================================================
# Intent Classifier Node
# ============================================================

def intent_classifier_node(state: AgentState) -> AgentState:

    print("\n==============================")
    print("INTENT CLASSIFIER")
    print("==============================")

    message = state["user_message"]

    detected_intent = intent_classifier.classify(message)

    state["intent"] = detected_intent

    print("Detected Intent:", detected_intent)

    return state


# ============================================================
# Log Interaction Tool Node
# ============================================================

def log_interaction_node(state: AgentState) -> AgentState:
    """
    Executes the Log Interaction tool and updates
    the graph state with the returned values.
    """

    print("\n==============================")
    print("LOG INTERACTION TOOL")
    print("==============================")

    try:

        result = log_interaction_tool(state)

        tool_result = result.get("tool_result", {})

        if tool_result.get("status") == "success":

            state["interaction_id"] = tool_result.get(
                "interaction_id"
            )

            state["summary"] = tool_result.get(
                "summary"
            )

            state["tool_output"] = {
                "status": "success",
                "interaction_id": state["interaction_id"],
                "summary": state["summary"]
}

            state["final_response"] = (
                "Interaction logged successfully.\n\n"
                f"Summary:\n{state['summary']}"
            )

            state["error"] = None

        else:

            error_message = tool_result.get(
                "message",
                "Unknown error occurred."
            )

            state["error"] = error_message

            state["tool_output"] = {
                "status": "error",
                "message": error_message
            }

            state["final_response"] = (
                "Sorry, I couldn't log the interaction."
            )

    except Exception as e:

        state["error"] = str(e)

        state["tool_output"] = {
            "status": "error",
            "message": str(e)
        }

        state["final_response"] = (
            "An unexpected error occurred while "
            "logging the interaction."
        )

    return state

# ============================================================
# Edit Interaction Tool Node
# ============================================================

def edit_interaction_node(
        state: AgentState
) -> AgentState:
    """
    Executes Edit Interaction tool
    and updates graph state.
    """

    print("\n==============================")
    print("EDIT INTERACTION TOOL")
    print("==============================")


    try:

        result = edit_interaction_tool(
            state
        )


        tool_result = (
            result.get(
                "tool_result",
                {}
            )
        )


        if tool_result.get("status") == "success":


            state["interaction_id"] = (
                tool_result.get(
                    "interaction_id"
                )
            )


            state["summary"] = (
                tool_result.get(
                    "summary"
                )
            )


            state["tool_output"] = result


            state["final_response"] = (
                "Interaction updated successfully.\n\n"
                f"Updated Summary:\n"
                f"{state['summary']}"
            )


            state["error"] = None



        else:


            error_message = (
                tool_result.get(
                    "message",
                    "Unknown error occurred."
                )
            )


            state["tool_output"] = result


            state["error"] = (
                error_message
            )


            state["final_response"] = (
                "Sorry, I couldn't update "
                "the interaction."
            )


    except Exception as e:


        state["tool_output"] = {

            "status":
            "error",

            "message":
            str(e)

        }


        state["error"] = (
            str(e)
        )


        state["final_response"] = (
            "An unexpected error occurred "
            "while updating interaction."
        )


    return state

# ============================================================
# Intent Router
# ============================================================

def route_intent(state: AgentState):

    intent = state["intent"]

    print("\n==============================")
    print("ROUTER")
    print("==============================")

    print("Routing Intent:", intent)

    if intent == "LOG_INTERACTION":
        return "log_interaction"

    elif intent == "EDIT_INTERACTION":
        return "edit_interaction"

    return END


# ============================================================
# Build Graph
# ============================================================

graph_builder = StateGraph(AgentState)


# ============================================================
# Register Nodes
# ============================================================

graph_builder.add_node(
    "start",
    start_node
)


graph_builder.add_node(
    "intent_classifier",
    intent_classifier_node
)


graph_builder.add_node(
    "log_interaction",
    log_interaction_node
)


graph_builder.add_node(
    "edit_interaction",
    edit_interaction_node
)


# ============================================================
# Entry Point
# ============================================================

graph_builder.set_entry_point(
    "start"
)


# ============================================================
# Graph Edges
# ============================================================

graph_builder.add_edge(
    "start",
    "intent_classifier"
)

graph_builder.add_conditional_edges(
    "intent_classifier",
    route_intent
)

graph_builder.add_edge(
    "log_interaction",
    END
)

graph_builder.add_edge(
    "edit_interaction",
    END
)


# ============================================================
# Compile Graph
# ============================================================

graph = graph_builder.compile()


# ============================================================
# Local Testing
# ============================================================

if __name__ == "__main__":

    sample_state = {

        "user_message":
        "Log today's meeting with Dr Sharma.",

        "intent":
        "",

        "tool_output":
        {},

        "final_response":
        "",

        "interaction_id":
        None,

        "hcp_name":
        None,

        "summary":
        None,

        "product":
        None,

        "follow_up":
        None,

        "error":
        None

    }

    result = graph.invoke(
        sample_state
    )

    print("\n==============================")
    print("GRAPH RESULT")
    print("==============================")

    print(result)