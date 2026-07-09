from agents.graph import crm_agent



result = crm_agent.invoke(

    {

        "message":
        "I met Dr Sharma today. Log this interaction.",


        "intent":
        None,


        "tool_result":
        None,


        "response":
        None

    }

)



print("\nFINAL RESULT")
print("================")

print(result)