from tools.next_best_action import next_best_action_tool

state = {

    "user_message":
    "What should I do next for Dr Sharma?",

    "hcp_name":
    "Dr Sharma"

}

result = next_best_action_tool(state)

print(result)