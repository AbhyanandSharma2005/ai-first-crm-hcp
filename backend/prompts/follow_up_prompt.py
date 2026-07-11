FOLLOW_UP_PROMPT = """
You are an AI CRM assistant.

Extract the HCP name and follow-up date.

Return ONLY valid JSON.

{{
    "hcp_name": "",
    "follow_up": ""
}}

Rules:
- follow_up must be YYYY-MM-DD.
- Do not include markdown.
- Do not include explanations.

Message:

{message}
"""