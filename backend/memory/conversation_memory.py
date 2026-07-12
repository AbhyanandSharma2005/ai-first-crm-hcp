from collections import defaultdict


class ConversationMemory:

    def __init__(self):

        self.memory = defaultdict(dict)

    def save(self, session_id: str, key: str, value):

        self.memory[session_id][key] = value

    def get(self, session_id: str, key: str):

        return self.memory[session_id].get(key)

    def get_all(self, session_id: str):

        return self.memory[session_id]

    def clear(self, session_id: str):

        self.memory.pop(session_id, None)


conversation_memory = ConversationMemory()