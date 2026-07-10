from typing import TypedDict
from backend.agents import state
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):

    user_message: str

    intent: str

    tool_output: str

    final_response: str
    
    def start_node(state: AgentState):

    print("Current State:")

    print(state)

    return state

graph_builder = StateGraph(AgentState)

graph_builder.add_node(
    "start",
    start_node
)

graph_builder.set_entry_point("start")

graph_builder.add_edge(
    "start",
    END
)

graph = graph_builder.compile()