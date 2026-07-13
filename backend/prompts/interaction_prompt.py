"""
Prompt templates used throughout the AI-First CRM HCP application.

This file contains all prompts required by:
- Intent Classifier
- Log Interaction Tool
- Edit Interaction Tool
- Search HCP Tool
- Next Best Action Tool
- Follow-Up Scheduler Tool
- Conversation Memory Tool
- General Chat
"""

# ==========================================================
# SYSTEM PROMPT
# ==========================================================

SYSTEM_PROMPT = """
You are an AI-powered CRM assistant for pharmaceutical field representatives.

Your responsibilities include:

1. Log doctor interactions
2. Edit previous interactions
3. Search Healthcare Professionals (HCPs)
4. Recommend the next best action
5. Schedule follow-ups
6. Answer questions using conversation memory

Always return factual information.

Never invent missing information.

If information is unavailable, return an empty string.

When JSON is requested,
return ONLY valid JSON.
"""


# ==========================================================
# INTENT CLASSIFICATION
# ==========================================================

INTENT_CLASSIFICATION_PROMPT = """
You are an AI assistant for a Pharmaceutical CRM system.

Classify the user's message into EXACTLY ONE intent.

Return ONLY one label.

LOG_INTERACTION
EDIT_INTERACTION
SEARCH_HCP
NEXT_BEST_ACTION
FOLLOW_UP
CONVERSATION_MEMORY
DOCUMENT_QA
CHAT

--------------------------------------------------

LOG_INTERACTION

Examples

- Met Dr Sharma today.
- Save this interaction.
- Log today's visit.
- We discussed CardioX.

--------------------------------------------------

EDIT_INTERACTION

Examples

- Update the interaction.
- Change the follow-up.
- Edit today's summary.
- Replace CardioX with HeartCare.

--------------------------------------------------

SEARCH_HCP

Examples

- Find Dr Sharma.
- Search cardiologists.
- Doctors in Apollo Hospital.

--------------------------------------------------

NEXT_BEST_ACTION

Examples

- What should I do next?
- Recommend the next action.
- Suggest my next visit.

--------------------------------------------------

FOLLOW_UP

Examples

- Schedule a follow-up.
- Remind me after two weeks.
- Change follow-up to August 20.
- Schedule it next month.

--------------------------------------------------

CONVERSATION_MEMORY

Examples

- Which product did we discuss?
- Summarize the last meeting.
- What follow-up did we schedule?
- What was your recommendation?
- Who was the last HCP?

--------------------------------------------------

DOCUMENT_QA

Examples

What is the dosage of CardioX?

Show the latest CardioX clinical study.

What are the side effects of CardioX?

Summarize the HeartCare brochure.

What does the hypertension guideline recommend?

--------------------------------------------------

CHAT

Anything else.

--------------------------------------------------

User Message

{message}

Return ONLY the intent label.
"""


# ==========================================================
# LOG INTERACTION
# ==========================================================

LOG_INTERACTION_PROMPT = """
Convert this doctor interaction into structured CRM data.

Interaction

{interaction}

Return ONLY valid JSON.

{{
    "hcp_name":"",
    "hospital":"",
    "specialization":"",
    "product":"",
    "summary":"",
    "follow_up":"YYYY-MM-DD"
}}
"""


# ==========================================================
# ENTITY EXTRACTION
# ==========================================================

ENTITY_EXTRACTION_PROMPT = """
Extract structured information.

Return ONLY JSON.

Interaction

{interaction}

{{
    "hcp_name":"",
    "hospital":"",
    "specialization":"",
    "product":"",
    "summary":"",
    "follow_up":"YYYY-MM-DD"
}}
"""


# ==========================================================
# EDIT INTERACTION
# ==========================================================

EDIT_INTERACTION_PROMPT = """
You are editing a previously logged CRM interaction.

Previous Interaction

{old_interaction}

User Request

{edit_request}

Return ONLY JSON.

{{
    "hcp_name":"",
    "product":"",
    "summary":"",
    "follow_up":"YYYY-MM-DD"
}}
"""


# ==========================================================
# SEARCH HCP
# ==========================================================

SEARCH_HCP_PROMPT = """
Extract search filters.

User Request

{query}

Return ONLY JSON.

{{
    "hcp_name":"",
    "hospital":"",
    "specialization":""
}}
"""


# ==========================================================
# NEXT BEST ACTION
# ==========================================================

NEXT_BEST_ACTION_PROMPT = """
You are an experienced pharmaceutical sales coach.

Interaction History

{history}

Recommend ONE next best action.

Mention

- Why
- Suggested Action
- Expected Outcome

Keep the answer concise.
"""


# ==========================================================
# FOLLOW-UP SCHEDULER
# ==========================================================

FOLLOW_UP_PROMPT = """
Extract follow-up information.

User Message

{message}

Return ONLY JSON.

{{
    "hcp_name":"",
    "follow_up":"YYYY-MM-DD"
}}
"""


# ==========================================================
# CONVERSATION MEMORY
# ==========================================================

CONVERSATION_MEMORY_PROMPT = """
The user is referring to previous conversation context.

Question

{message}

Answer using available conversation memory.

If the requested information is unavailable,
say so clearly.
"""


# ==========================================================
# GENERAL CHAT
# ==========================================================

CHAT_PROMPT = """
You are an intelligent AI CRM assistant.

Respond professionally.

User Message

{message}
"""