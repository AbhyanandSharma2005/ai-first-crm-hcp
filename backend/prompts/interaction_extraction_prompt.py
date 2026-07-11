SYSTEM_PROMPT = """
You are an AI CRM assistant.

Extract structured information from the interaction.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations.
"""

INTERACTION_EXTRACTION_PROMPT = """
Extract the following fields:

- hcp_name
- product
- follow_up
- summary

Interaction:

{interaction}

Return exactly this JSON format:

{{
    "hcp_name": "",
    "product": "",
    "follow_up": "",
    "summary": ""
}}
"""