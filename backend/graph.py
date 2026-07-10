"""
graph.py

LangGraph Agent for AI-First CRM HCP Module

This graph will manage:
1. Intent Classification
2. Tool Selection
3. Tool Execution
4. Response Generation
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

    # Original user message
    user_message: str

    # Intent detected by the classifier
    intent: str

    # Output produced by a tool
    tool_output: str

    # Final response returned to frontend
    final_response: str

    # -------- Future fields --------

    interaction_id: Optional[int]

    hcp_name: Optional[str]

    summary: Optional[str]

    product: Optional[str]

    follow_up: Optional[str]

    error: Optional[str]


# ============================================================
# Start Node
# ============================================================
def intent_classifier_node(state: AgentState) -> AgentState:
    message = state["user_message"]

    detected_intent = intent_classifier.classify(message)

    state["intent"] = detected_intent

    return state

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

graph_builder.add_edge(
    "intent_classifier",
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

    result = graph.invoke(
        sample_state
    )

    print("\n==============================")
    print("GRAPH RESULT")
    print("==============================")

    print(result)