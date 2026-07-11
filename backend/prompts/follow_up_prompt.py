FOLLOW_UP_PROMPT = """
Extract the follow-up information.

User message:

{message}

Return ONLY JSON.

{
    "hcp_name":"",
    "follow_up":"YYYY-MM-DD"
}
"""