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
Selected Tool
   ↓
END
"""

from typing import TypedDict, Optional, Any

from langgraph.graph import StateGraph, END

from services.intent_classifier import intent_classifier

from tools.log_interaction import log_interaction_tool
from tools.edit_interaction import edit_interaction_tool
from tools.search_hcp import search_hcp_tool
from tools.next_best_action import next_best_action_tool


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

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["interaction_id"] = tool_result.get(
                "interaction_id",
                state["interaction_id"]
            )

            state["hcp_name"] = tool_result.get(
                "hcp_name",
                state["hcp_name"]
            )

            state["product"] = tool_result.get(
                "product",
                state["product"]
            )

            # FIXED (Issue 1)
            state["follow_up"] = tool_result.get(
                "follow_up",
                state["follow_up"]
            )

            # FIXED (Issue 1)
            state["summary"] = tool_result.get(
                "summary",
                state["summary"]
            )

            state["tool_output"] = result

            state["final_response"] = (
                "Interaction logged successfully.\n\n"
                f"HCP: {state['hcp_name']}\n"
                f"Product: {state['product']}\n"
                f"Follow-up: {state['follow_up']}\n\n"
                f"Summary:\n{state['summary']}"
            )

            state["error"] = None

        else:

            error_message = tool_result.get(
                "message",
                "Unknown error occurred."
            )

            state["tool_output"] = result

            state["error"] = error_message

            state["final_response"] = (
                "Sorry, I couldn't log the interaction."
            )

    except Exception as e:

        # FIXED (Issue 5)
        state["tool_output"] = {
            "tool_result": {
                "status": "error",
                "message": str(e)
            }
        }

        state["error"] = str(e)

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

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["interaction_id"] = tool_result.get(
                "interaction_id",
                state["interaction_id"]
            )

            state["hcp_name"] = tool_result.get(
                "hcp_name",
                state["hcp_name"]
            )

            state["product"] = tool_result.get(
                "product",
                state["product"]
            )

            state["follow_up"] = tool_result.get(
                "follow_up",
                state["follow_up"]
            )

            state["summary"] = tool_result.get(
                "summary",
                state["summary"]
            )

            state["tool_output"] = result

            state["final_response"] = (
                "Interaction updated successfully.\n\n"
                f"HCP: {state['hcp_name']}\n"
                f"Product: {state['product']}\n"
                f"Follow-up: {state['follow_up']}\n\n"
                f"Updated Summary:\n"
                f"{state['summary']}"
            )

            state["error"] = None

        else:

            error_message = tool_result.get(
                "message",
                "Unknown error occurred."
            )

            state["tool_output"] = result

            state["error"] = error_message

            state["final_response"] = (
                "Sorry, I couldn't update "
                "the interaction."
            )

    except Exception as e:

        state["tool_output"] = {
            "tool_result": {
                "status": "error",
                "message": str(e)
            }
        }

        state["error"] = str(e)

        state["final_response"] = (
            "An unexpected error occurred "
            "while updating interaction."
        )

    return state


# ============================================================
# Search HCP Tool Node
# ============================================================

def search_hcp_node(
        state: AgentState
) -> AgentState:

    print("\n==============================")
    print("SEARCH HCP TOOL")
    print("==============================")

    try:

        result = search_hcp_tool(
            state
        )

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["tool_output"] = result

            doctors = tool_result.get(
                "hcp",
                []
            )

            if doctors:

                response = (
                    "Matching HCPs:\n\n"
                )

                for doctor in doctors:

                    response += (
                        f"Name: {doctor['name']}\n"
                        f"Specialization: "
                        f"{doctor['specialization']}\n"
                        f"Hospital: "
                        f"{doctor['hospital']}\n\n"
                    )

                state["final_response"] = response

            else:

                state["final_response"] = (
                    "No matching HCP found."
                )

            state["error"] = None

        else:

            state["tool_output"] = result

            state["error"] = tool_result.get(
                "message",
                "Unable to search HCP."
            )

            state["final_response"] = (
                "Unable to search HCP."
            )

    except Exception as e:

        state["tool_output"] = {
            "tool_result": {
                "status": "error",
                "message": str(e)
            }
        }

        state["error"] = str(e)

        state["final_response"] = (
            "Search failed."
        )

    return state


# ============================================================
# Next Best Action Tool Node
# ============================================================

def next_best_action_node(
        state: AgentState
) -> AgentState:
    """
    Executes the Next Best Action tool
    and updates graph state.
    """

    print("\n==============================")
    print("NEXT BEST ACTION TOOL")
    print("==============================")

    try:

        result = next_best_action_tool(
            state
        )

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["tool_output"] = result

            state["final_response"] = (
                "Next Best Action\n\n"
                + tool_result.get(
                    "recommendation",
                    "No recommendation available."
                )
            )

            state["error"] = None

        else:

            error_message = tool_result.get(
                "message",
                "Unable to generate recommendation."
            )

            state["tool_output"] = result

            state["error"] = error_message

            state["final_response"] = error_message

    except Exception as e:

        state["tool_output"] = {
            "tool_result": {
                "status": "error",
                "message": str(e)
            }
        }

        state["error"] = str(e)

        state["final_response"] = (
            "An unexpected error occurred "
            "while generating the recommendation."
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
    print("Routing:", intent)

    if intent == "LOG_INTERACTION":
        return "log_interaction"

    elif intent == "EDIT_INTERACTION":
        return "edit_interaction"

    elif intent == "SEARCH_HCP":
        return "search_hcp"

    elif intent == "NEXT_BEST_ACTION":
        return "next_best_action"

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

graph_builder.add_node(
    "search_hcp",
    search_hcp_node
)

graph_builder.add_node(
    "next_best_action",
    next_best_action_node
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

graph_builder.add_edge(
    "search_hcp",
    END
)

graph_builder.add_edge(
    "next_best_action",
    END
)


# ============================================================
# Compile Graph
# ============================================================

graph = graph_builder.compile()


# ============================================================
# Local Testing
# ============================================================

print("graph.py loaded successfully")


if __name__ == "__main__":

    sample_state = {

        "user_message":
        """
# Met Dr Sharma today.

# Discussed CardioX.

# Doctor requested latest clinical study.

# Follow up on 2026-07-25.

Find cardiologists
""",

        "intent": "",

        "tool_output": {},

        "final_response": "",

        "interaction_id": None,

        "hcp_name": None,

        "summary": None,

        "product": None,

        "follow_up": None,

        "error": None

    }

    result = graph.invoke(sample_state)

    print("\n==============================")
    print("GRAPH RESULT")
    print("==============================")

    print(result)