from tools.search_hcp import search_hcp_tool



state = {

    "user_message":
    "Find cardiologists"

}



result = search_hcp_tool(
    state
)


print(result)