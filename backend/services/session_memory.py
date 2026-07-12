"""
Simple in-memory conversation store.

Each session_id stores:

1. Complete AgentState
2. Important conversation variables

This makes multi-turn conversations possible.
"""

from copy import deepcopy


class SessionMemory:

    def __init__(self):

        # Complete AgentState
        self.sessions = {}

        # Conversation variables
        self.values = {}

    # =====================================================
    # AgentState Methods
    # =====================================================

    def get(self, session_id: str):

        return deepcopy(
            self.sessions.get(session_id)
        )

    def save(
        self,
        session_id: str,
        state: dict
    ):

        self.sessions[session_id] = deepcopy(state)

    # =====================================================
    # Conversation Memory Methods
    # =====================================================

    def set_value(
        self,
        session_id: str,
        key: str,
        value
    ):

        if session_id not in self.values:

            self.values[session_id] = {}

        self.values[session_id][key] = deepcopy(value)

    def get_value(
        self,
        session_id: str,
        key: str
    ):

        if session_id not in self.values:

            return None

        return deepcopy(

            self.values[session_id].get(key)

        )

    # =====================================================
    # Utility Methods
    # =====================================================

    def exists(
        self,
        session_id: str
    ):

        return session_id in self.sessions

    def clear(
        self,
        session_id: str
    ):

        if session_id in self.sessions:

            del self.sessions[session_id]

        if session_id in self.values:

            del self.values[session_id]


session_memory = SessionMemory()