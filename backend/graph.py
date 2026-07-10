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
Log Interaction Tool (Placeholder)
   ↓
END
"""

from typing import TypedDict, Optional

from langgraph.graph import StateGraph, END

from services.intent_classifier import intent_classifier


# ============================================================
# Agent State
# ============================================================

class AgentState(TypedDict):
    """
    Shared state used by every LangGraph node.
    """

    user_message: str

    intent: str

    tool_output: str

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
# Placeholder Tool
# ============================================================

def log_interaction_node(state: AgentState) -> AgentState:
    """
    Temporary placeholder.
    Later this will call the real Interaction Service.
    """

    print("\n==============================")
    print("LOG INTERACTION TOOL")
    print("==============================")

    state["tool_output"] = (
        f"[Placeholder] Interaction logged for message: "
        f"{state['user_message']}"
    )

    state["final_response"] = state["tool_output"]

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


# ============================================================
# Entry Point
# ============================================================

graph_builder.set_entry_point("start")


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
        "",

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

    result = graph.invoke(sample_state)

    print("\n==============================")
    print("GRAPH RESULT")
    print("==============================")

    print(result)