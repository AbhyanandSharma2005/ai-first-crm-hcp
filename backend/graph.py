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

def start_node(state: AgentState):
    """
    Entry point of LangGraph.

    Currently only prints state.

    In Phase 7.2 it will forward
    to the Intent Classifier.
    """

    print("\n==============================")
    print("START NODE")
    print("==============================")

    print("Incoming State:")
    print(state)

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