from graph import graph

state = {

    "user_message":
    "Hello",

    "intent":
    "",

    "tool_output":
    "",

    "final_response":
    ""

}

result = graph.invoke(state)

print(result)