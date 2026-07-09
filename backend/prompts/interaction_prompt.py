"""
Prompt templates used by the AI-First CRM HCP Module.

These prompts are consumed by:
- Groq Service
- LangGraph Agent
- LangGraph Tools
"""

# ==========================================================
# SYSTEM PROMPT
# ==========================================================

SYSTEM_PROMPT = """
You are an AI-powered CRM assistant for pharmaceutical field representatives.

Your responsibilities include:

1. Summarizing meetings with Healthcare Professionals (HCPs)
2. Extracting structured information
3. Suggesting next best actions
4. Scheduling follow-ups
5. Helping edit previously logged interactions

Always produce professional, concise and structured responses.

Never invent facts that are not present in the conversation.

If information is missing, clearly mention it.
"""


# ==========================================================
# INTERACTION SUMMARY PROMPT
# ==========================================================

INTERACTION_SUMMARY_PROMPT = """
You are given notes from a pharmaceutical sales representative.

Create a professional CRM interaction summary.

Interaction Notes:

{interaction}

Provide only the summary.
"""


# ==========================================================
# ENTITY EXTRACTION PROMPT
# ==========================================================

ENTITY_EXTRACTION_PROMPT = """
Extract the following information from the interaction.

Return ONLY valid JSON.

Fields:

doctor_name
hospital
specialization
product
summary
follow_up

Interaction:

{interaction}
"""


# ==========================================================
# LOG INTERACTION PROMPT
# ==========================================================

LOG_INTERACTION_PROMPT = """
Convert the following conversation into structured CRM data.

Conversation:

{interaction}

Return ONLY JSON in this format.

{
    "doctor_name": "",
    "hospital": "",
    "specialization": "",
    "product": "",
    "summary": "",
    "follow_up": ""
}
"""


# ==========================================================
# EDIT INTERACTION PROMPT
# ==========================================================

EDIT_INTERACTION_PROMPT = """
A user wants to edit a previously logged CRM interaction.

Original Interaction

{old_interaction}

Requested Change

{edit_request}

Return the updated interaction in JSON format only.
"""


# ==========================================================
# SEARCH HCP PROMPT
# ==========================================================

SEARCH_HCP_PROMPT = """
The sales representative wants to search for healthcare professionals.

User Request:

{query}

Determine the important search filters.

Return JSON only.

{
    "doctor_name":"",
    "hospital":"",
    "specialization":""
}
"""


# ==========================================================
# NEXT BEST ACTION PROMPT
# ==========================================================

NEXT_BEST_ACTION_PROMPT = """
You are an experienced pharmaceutical sales coach.

Interaction History

{history}

Recommend the next best action.

Keep the answer short.

Mention:

- Why
- Suggested action
- Expected outcome
"""


# ==========================================================
# FOLLOW-UP PROMPT
# ==========================================================

FOLLOWUP_PROMPT = """
Interaction Summary

{summary}

Suggest an appropriate follow-up plan.

Include

1. Follow-up date

2. Reason

3. Action items
"""


# ==========================================================
# CHAT PROMPT
# ==========================================================

CHAT_PROMPT = """
You are an intelligent AI CRM assistant.

Answer the user's question professionally.

User Message:

{message}
"""


# ==========================================================
# INTENT CLASSIFICATION PROMPT
# ==========================================================

INTENT_CLASSIFICATION_PROMPT = """
Classify the user's intent.

Possible intents:

1. log_interaction

2. edit_interaction

3. search_hcp

4. next_best_action

5. follow_up

6. general_chat

Return ONLY one intent.

User:

{message}
"""