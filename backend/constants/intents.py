"""
constants/intents.py

Defines all supported intents used by the LangGraph agent.
"""


# ==========================================
# Interaction Management
# ==========================================

LOG_INTERACTION = "LOG_INTERACTION"

EDIT_INTERACTION = "EDIT_INTERACTION"


# ==========================================
# HCP Search
# ==========================================

SEARCH_HCP = "SEARCH_HCP"


# ==========================================
# AI Recommendation
# ==========================================

NEXT_BEST_ACTION = "NEXT_BEST_ACTION"


# ==========================================
# Follow-up
# ==========================================

FOLLOW_UP = "FOLLOW_UP"

CONVERSATION_MEMORY = "CONVERSATION_MEMORY"


# ==========================================
# General Chat
# ==========================================

CHAT = "CHAT"


# ==========================================
# List of Supported Intents
# ==========================================

SUPPORTED_INTENTS = [

    LOG_INTERACTION,

    EDIT_INTERACTION,

    SEARCH_HCP,

    NEXT_BEST_ACTION,

    FOLLOW_UP,
    
    CONVERSATION_MEMORY,

    CHAT

]