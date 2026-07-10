"""
services/intent_classifier.py

Uses the Groq LLM to classify the user's intent.
"""

from constants.intents import (
    LOG_INTERACTION,
    EDIT_INTERACTION,
    SEARCH_HCP,
    NEXT_BEST_ACTION,
    FOLLOW_UP,
    CHAT,
    SUPPORTED_INTENTS,
)

from prompts.interaction_prompt import (
    INTENT_CLASSIFICATION_PROMPT,
)

from services.groq_service import groq_service


class IntentClassifier:
    """
    Classifies a user message into one of the supported intents.
    """

    def __init__(self):
        self.supported_intents = SUPPORTED_INTENTS

    def classify(self, message: str) -> str:
        """
        Returns one of the supported intent labels.

        Parameters
        ----------
        message : str
            User message.

        Returns
        -------
        str
            Intent label.
        """

        if not message or not message.strip():
            return CHAT

        prompt = INTENT_CLASSIFICATION_PROMPT.format(
            message=message
        )

        try:

            response = groq_service.generate_response(
                prompt=prompt,
                temperature=0.0,
                max_tokens=20
            )

            intent = response.strip().upper()

            # Sometimes models return punctuation
            intent = intent.replace(".", "")
            intent = intent.replace("`", "")
            intent = intent.replace('"', "")
            intent = intent.replace("'", "")

            # Remove accidental extra lines
            intent = intent.split("\n")[0].strip()

            if intent in self.supported_intents:
                return intent

            # Fallback keyword matching
            return self._fallback_classifier(message)

        except Exception as e:

            print(f"Intent Classification Error: {e}")

            return self._fallback_classifier(message)

    def _fallback_classifier(self, message: str) -> str:
        """
        Rule-based fallback if the LLM fails.
        """

        text = message.lower()

        # Log interaction
        if any(word in text for word in [
            "log",
            "save",
            "record",
            "meeting",
            "interaction",
            "visited",
            "met"
        ]):
            return LOG_INTERACTION

        # Edit interaction
        if any(word in text for word in [
            "edit",
            "update",
            "modify",
            "change"
        ]):
            return EDIT_INTERACTION

        # Search HCP
        if any(word in text for word in [
            "find",
            "search",
            "doctor",
            "hospital",
            "hcp",
            "cardiologist",
            "physician"
        ]):
            return SEARCH_HCP

        # Next best action
        if any(word in text for word in [
            "next",
            "recommend",
            "recommendation",
            "suggest",
            "action"
        ]):
            return NEXT_BEST_ACTION

        # Follow-up
        if any(word in text for word in [
            "follow",
            "follow-up",
            "schedule",
            "remind",
            "reminder"
        ]):
            return FOLLOW_UP

        return CHAT


# Singleton instance
intent_classifier = IntentClassifier()