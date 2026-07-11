FOLLOW_UP_PROMPT = """
Extract the follow-up information from the user's message.

Return ONLY valid JSON.

{
    "hcp_name": "",
    "follow_up": "YYYY-MM-DD"
}

User Message:

{message}
"""