"""
graph.py

LangGraph Agent for AI-First CRM HCP Module

This graph will manage:
1. Intent Classification
2. Tool Selection
3. Tool Execution
4. Response Generation
"""

from typing import TypedDict

from langgraph.graph import StateGraph, END


# ============================================================
# Agent State
# ============================================================

class AgentState(TypedDict):
    """
    Shared state across all LangGraph nodes.
    """

    # User message from frontend
    user_message: str

    # Intent predicted by the agent
    intent: str

    # Output returned by selected tool
    tool_output: str

    # Final response sent back to frontend
    final_response: str


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
        "Hello AI",

        "intent":
        "",

        "tool_output":
        "",

        "final_response":
        ""

    }

    result = graph.invoke(
        sample_state
    )

    print("\n==============================")
    print("GRAPH RESULT")
    print("==============================")

    print(result)