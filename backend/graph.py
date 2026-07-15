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

from services.session_memory import session_memory
from langgraph.graph import StateGraph, END


from services.intent_classifier import intent_classifier

from tools.log_interaction import log_interaction_tool
from tools.edit_interaction import edit_interaction_tool
from tools.search_hcp import search_hcp_tool
from tools.next_best_action import next_best_action_tool
from tools.followup_scheduler import follow_up_scheduler_tool
from services.session_memory import session_memory
from tools.conversation_memory_tool import conversation_memory_tool
print(
    "conversation_memory_tool loaded:",
    conversation_memory_tool
)

from nodes.response_builder import response_builder_node
from tools.rag_tool import rag_tool


# ============================================================
# Agent State
# ============================================================

class AgentState(TypedDict):
    """
    Shared state used by every LangGraph node.
    """
    session_id: str

    conversation: dict[str, Any]

    user_message: str
    intent: str

    tool_output: dict[str, Any]

    final_response: str
    
    sources: list[str]

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
        conversation = session_memory.get_all(
            state["session_id"]
        )

        state["conversation"] = conversation

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
    Executes the Log Interaction tool,
    updates graph state,
    and stores important values in Session Memory.
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

            # --------------------------------------------------
            # Update Agent State
            # --------------------------------------------------

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

            state["error"] = None

            # --------------------------------------------------
            # Save Conversation Memory
            # --------------------------------------------------

            session_id = state.get("session_id")

            if session_id:

                session_memory.set_value(
                    session_id,
                    "last_hcp",
                    state["hcp_name"]
                )

                session_memory.set_value(
                    session_id,
                    "last_product",
                    state["product"]
                )

                session_memory.set_value(
                    session_id,
                    "last_summary",
                    state["summary"]
                )

                session_memory.set_value(
                    session_id,
                    "last_follow_up",
                    state["follow_up"]
                )

                session_memory.set_value(
                    session_id,
                    "last_interaction_id",
                    state["interaction_id"]
                )

            # --------------------------------------------------
            # Final Response
            # --------------------------------------------------

            state["final_response"] = (
                "Interaction logged successfully.\n\n"
                f"HCP: {state['hcp_name']}\n"
                f"Product: {state['product']}\n"
                f"Follow-up: {state['follow_up']}\n\n"
                f"Summary:\n{state['summary']}"
            )

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

        state["tool_output"] = {
            "tool_result": {
                "status": "error",
                "message": str(e)
            }
        }

        state["error"] = str(e)

        state["final_response"] = (
            "An unexpected error occurred while logging the interaction."
        )

    return state

# ============================================================
# Edit Interaction Tool Node
# ============================================================

def edit_interaction_node(state: AgentState) -> AgentState:
    """
    Executes Edit Interaction tool,
    updates graph state,
    and refreshes Session Memory.
    """

    print("\n==============================")
    print("EDIT INTERACTION TOOL")
    print("==============================")

    try:

        result = edit_interaction_tool(state)

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            # --------------------------------------------------
            # Update Agent State
            # --------------------------------------------------

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

            state["error"] = None

            # --------------------------------------------------
            # Update Session Memory
            # --------------------------------------------------

            session_id = state.get("session_id")

            if session_id:

                session_memory.set_value(
                    session_id,
                    "last_hcp",
                    state["hcp_name"]
                )

                session_memory.set_value(
                    session_id,
                    "last_product",
                    state["product"]
                )

                session_memory.set_value(
                    session_id,
                    "last_summary",
                    state["summary"]
                )

                session_memory.set_value(
                    session_id,
                    "last_follow_up",
                    state["follow_up"]
                )

                session_memory.set_value(
                    session_id,
                    "last_interaction_id",
                    state["interaction_id"]
                )

            # --------------------------------------------------
            # Final Response
            # --------------------------------------------------

            state["final_response"] = (
                "Interaction updated successfully.\n\n"
                f"HCP: {state['hcp_name']}\n"
                f"Product: {state['product']}\n"
                f"Follow-up: {state['follow_up']}\n\n"
                f"Updated Summary:\n{state['summary']}"
            )

        else:

            error_message = tool_result.get(
                "message",
                "Unknown error occurred."
            )

            state["tool_output"] = result

            state["error"] = error_message

            state["final_response"] = (
                "Sorry, I couldn't update the interaction."
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
            "An unexpected error occurred while updating interaction."
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

        result = search_hcp_tool(state)

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

            # ------------------------------------------
            # Save conversation memory
            # ------------------------------------------

            session_id = state.get("session_id")

            if session_id:

                session_memory.set_value(
                    session_id,
                    "last_search",
                    doctors
                )

                if doctors:

                    session_memory.set_value(
                        session_id,
                        "last_hcp",
                        doctors[0]["name"]
                    )
                    
                    print("\n===== SAVING MEMORY =====")
                    print("Session:", session_id)
                    print("Saving:", doctors[0]["name"])
                    print("=========================\n")

            # ------------------------------------------
            # Build Response
            # ------------------------------------------

            if doctors:

                response = "Matching HCPs:\n\n"

                for doctor in doctors:

                    response += (
                        f"Name: {doctor['name']}\n"
                        f"Specialization: {doctor['specialization']}\n"
                        f"Hospital: {doctor['hospital']}\n\n"
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
    and updates Session Memory.
    """

    print("\n==============================")
    print("NEXT BEST ACTION TOOL")
    print("==============================")

    try:

        result = next_best_action_tool(state)

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["hcp_name"] = tool_result.get(
                "hcp_name",
                state["hcp_name"]
            )

            # ------------------------------------------
            # Save Conversation Memory
            # ------------------------------------------

            session_id = state.get("session_id")

            if session_id:

                session_memory.set_value(
                    session_id,
                    "last_hcp",
                    state["hcp_name"]
                )

                session_memory.set_value(
                    session_id,
                    "last_recommendation",
                    tool_result.get(
                        "recommendation"
                    )
                )

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
# Follow Up Scheduler Tool Node
# ============================================================

def follow_up_scheduler_node(
        state: AgentState
) -> AgentState:
    """
    Executes the Follow-Up Scheduler tool,
    updates graph state,
    and stores follow-up information in Session Memory.
    """

    print("\n==============================")
    print("FOLLOW UP SCHEDULER TOOL")
    print("==============================")

    try:

        result = follow_up_scheduler_tool(
            state
        )

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            # --------------------------------------------------
            # Update Agent State
            # --------------------------------------------------

            state["interaction_id"] = tool_result.get(
                "interaction_id",
                state["interaction_id"]
            )

            state["hcp_name"] = tool_result.get(
                "hcp_name",
                state["hcp_name"]
            )

            state["follow_up"] = tool_result.get(
                "follow_up",
                state["follow_up"]
            )

            state["tool_output"] = result

            state["error"] = None

            # --------------------------------------------------
            # Update Session Memory
            # --------------------------------------------------

            session_id = state.get("session_id")

            if session_id:

                session_memory.set_value(
                    session_id,
                    "last_hcp",
                    state["hcp_name"]
                )

                session_memory.set_value(
                    session_id,
                    "last_follow_up",
                    state["follow_up"]
                )

                session_memory.set_value(
                    session_id,
                    "last_interaction_id",
                    state["interaction_id"]
                )

            # --------------------------------------------------
            # Final Response
            # --------------------------------------------------

            state["final_response"] = (
                "Follow-up scheduled successfully.\n\n"
                f"HCP: {state['hcp_name']}\n"
                f"Follow-up Date: {state['follow_up']}"
            )

        else:

            error_message = tool_result.get(
                "message",
                "Unable to schedule follow-up."
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
            "Unexpected error while scheduling follow-up."
        )

    return state

# ============================================================
# Conversation Memory Tool Node
# ============================================================

def conversation_memory_node(
        state: AgentState
) -> AgentState:

    print("\n==============================")
    print("CONVERSATION MEMORY TOOL")
    print("==============================")

    try:

        result = conversation_memory_tool(state)

        tool_result = result.get(
            "tool_result",
            {}
        )

        if tool_result.get("status") == "success":

            state["tool_output"] = result

            state["final_response"] = tool_result.get(
                "answer",
                "No information found."
            )

            state["error"] = None

        else:

            state["tool_output"] = result

            state["error"] = tool_result.get(
                "message"
            )

            state["final_response"] = tool_result.get(
                "message"
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
            "Conversation memory failed."
        )

    return state

def rag_node(state: AgentState) -> AgentState:

    print()
    print("==============================")
    print("RAG TOOL")
    print("==============================")

    try:

        result = rag_tool(state)

        tool_result = result["tool_result"]

        state["tool_output"] = result
        
        state["sources"] = tool_result["sources"]

        state["final_response"] = tool_result["answer"]

        state["error"] = None

    except Exception as e:

        state["error"] = str(e)

        state["final_response"] = (
            "Unable to answer from documents."
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
    
    elif intent == "FOLLOW_UP":
        return "follow_up_scheduler"

    elif intent == "CONVERSATION_MEMORY":
        return "conversation_memory"
    
    elif intent == "DOCUMENT_QA":
         return "rag"
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

graph_builder.add_node(

    "follow_up_scheduler",

    follow_up_scheduler_node

)

graph_builder.add_node(

    "conversation_memory",

    conversation_memory_node

)

graph_builder.add_node(

    "rag",

    rag_node

)

graph_builder.add_node(
    "response_builder",
    response_builder_node
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
    "response_builder"
)

graph_builder.add_edge(
    "next_best_action",
    END
)

graph_builder.add_edge(

    "follow_up_scheduler",

    END

)

graph_builder.add_edge(
    "conversation_memory",
    END
)

graph_builder.add_edge(
    "rag",
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
Met Dr Sharma today.

Discussed CardioX.

Doctor requested latest clinical study.

Follow up on 2026-07-25.

Find cardiologists

Update Dr Sharma interaction to include brochure discussion.

What should I do next for Dr Sharma?
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