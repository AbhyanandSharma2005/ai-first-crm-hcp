from services.groq_service import groq_service


def next_best_action_tool(state):


    prompt=f"""

Review this interaction history:

{state.get('summary')}


Recommend the next best action.

"""


    response = groq_service.chat(

        system_prompt=
        "You are CRM sales assistant",

        user_prompt=
        prompt

    )


    return {

        "tool_result":{

            "status":"success",

            "recommendation":
            response

        }

    }