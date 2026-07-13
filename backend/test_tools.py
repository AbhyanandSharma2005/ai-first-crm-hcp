from backend.agents.old_graph import crm_agent



messages = [

    "Log my meeting with Dr Sharma",

    "Edit my previous interaction",

    "Find cardiologists",

    "What should I do next with this doctor?",

    "Schedule follow up"

]



for msg in messages:


    print("\n================")

    print(msg)


    result = crm_agent.invoke(

        {

            "message":msg,

            "intent":None,

            "tool_result":None,

            "response":None

        }

    )


    print(result["response"])