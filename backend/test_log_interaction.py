from tools.log_interaction import log_interaction_tool

state = {

    "user_message": """
    Met Dr Sharma today.

    Discussed CardioX.

    Doctor requested the latest clinical study.

    Follow up on 2026-07-25.
    """

}

result = log_interaction_tool(state)

print(result)