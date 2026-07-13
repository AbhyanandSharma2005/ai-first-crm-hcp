from langgraph.graph import (
    StateGraph,
    START,
    END
)


from agents.state import AgentState


from services.groq_service import groq_service


from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    INTENT_CLASSIFICATION_PROMPT
)


from tools.log_interaction import (
    log_interaction_tool
)

from tools.edit_interaction import (
    edit_interaction_tool
)

from tools.search_hcp import (
    search_hcp_tool
)

from tools.next_best_action import (
    next_best_action_tool
)

from tools.followup_scheduler import (
    followup_scheduler_tool
)



# ==================================================
# NODE 1
# INTENT CLASSIFIER
# ==================================================

def intent_classifier(state: AgentState):


    message = state["message"]


    prompt = INTENT_CLASSIFICATION_PROMPT.format(
        message=message
    )


    response = groq_service.chat(

        system_prompt=SYSTEM_PROMPT,

        user_prompt=prompt

    )


    intent = response.strip().lower()


    return {

        "intent": intent

    }




# ==================================================
# ROUTER FUNCTION
# ==================================================

def intent_router(state: AgentState):


    intent = state["intent"]



    if "log" in intent:

        return "log"


    elif "edit" in intent:

        return "edit"


    elif "search" in intent:

        return "search"


    elif "next" in intent:

        return "next"


    elif "follow" in intent:

        return "follow"


    else:

        return "log"





# ==================================================
# FINAL RESPONSE NODE
# ==================================================

def final_response(state: AgentState):


    result = state.get(
        "tool_result"
    )


    return {


        "response":
        str(result)

    }




# ==================================================
# CREATE GRAPH
# ==================================================


workflow = StateGraph(
    AgentState
)



# Add Nodes


workflow.add_node(

    "intent_classifier",

    intent_classifier

)



workflow.add_node(

    "log",

    log_interaction_tool

)



workflow.add_node(

    "edit",

    edit_interaction_tool

)



workflow.add_node(

    "search",

    search_hcp_tool

)



workflow.add_node(

    "next",

    next_best_action_tool

)



workflow.add_node(

    "follow",

    followup_scheduler_tool

)



workflow.add_node(

    "final_response",

    final_response

)




# ==================================================
# EDGES
# ==================================================


workflow.add_edge(

    START,

    "intent_classifier"

)



workflow.add_conditional_edges(

    "intent_classifier",

    intent_router,


    {


        "log":
        "log",


        "edit":
        "edit",


        "search":
        "search",


        "next":
        "next",


        "follow":
        "follow"


    }

)



# Tools → Final Response


workflow.add_edge(

    "log",

    "final_response"

)



workflow.add_edge(

    "edit",

    "final_response"

)



workflow.add_edge(

    "search",

    "final_response"

)



workflow.add_edge(

    "next",

    "final_response"

)



workflow.add_edge(

    "follow",

    "final_response"

)



workflow.add_edge(

    "final_response",

    END

)



# Compile Agent


crm_agent = workflow.compile()