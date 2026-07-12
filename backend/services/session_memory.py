"""
Simple in-memory conversation store.

Each session_id has its own AgentState.
"""

from copy import deepcopy


class SessionMemory:

    def __init__(self):

        self.sessions = {}

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


session_memory = SessionMemory()