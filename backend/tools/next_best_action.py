from services.groq_service import groq_service

from prompts.interaction_prompt import SYSTEM_PROMPT



def next_best_action_tool(state):


    prompt = f"""

You are a pharmaceutical CRM assistant.

Based on this interaction:

{state["message"]}


Suggest:

1. Next action
2. Follow up strategy
3. Recommended communication


"""


    response = groq_service.chat(

        system_prompt=SYSTEM_PROMPT,

        user_prompt=prompt

    )


    return {


        "tool_result":

        {

            "recommendation":
            response

        }

    }