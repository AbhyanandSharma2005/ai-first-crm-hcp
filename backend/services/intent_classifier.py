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
    CONVERSATION_MEMORY,
    DOCUMENT_QA,
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

    def classify(
        self,
        message: str
    ) -> str:
        """
        Returns one of the supported intent labels.
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

            intent = (
                intent
                .replace(".", "")
                .replace("`", "")
                .replace('"', "")
                .replace("'", "")
            )

            intent = intent.split("\n")[0].strip()

            if intent in self.supported_intents:

                return intent

            return self._fallback_classifier(
                message
            )

        except Exception as e:

            print(
                f"Intent Classification Error: {e}"
            )

            return self._fallback_classifier(
                message
            )

    def _fallback_classifier(
        self,
        message: str
    ) -> str:
        """
        Rule-based fallback classifier.
        """

        text = message.lower()

        # ====================================================
        # CONVERSATION MEMORY
        # ====================================================

        if any(word in text for word in [

            "which product",
            "what product",
            "product did we discuss",
            "last product",

            "summary",
            "summarize",
            "last meeting",
            "meeting summary",

            "follow-up date",
            "follow up date",
            "when is the follow",
            "when is the follow-up",
            "last follow-up",

            "recommendation",
            "what did you recommend",
            "last recommendation",

            "last doctor",
            "last hcp",
            "which doctor",
            "who did we discuss",

            "previous interaction",
            "last interaction"

        ]):

            return CONVERSATION_MEMORY

        # ====================================================
        # EDIT INTERACTION
        # ====================================================

        if any(word in text for word in [

            "edit",
            "update",
            "modify",
            "change",
            "correct",
            "alter"

        ]):

            return EDIT_INTERACTION

        # ====================================================
        # LOG INTERACTION
        # ====================================================

        if any(word in text for word in [

            "log",
            "save",
            "record",
            "visited",
            "met",
            "meeting",
            "interaction",
            "discussed"

        ]):

            return LOG_INTERACTION

        # ====================================================
        # DOCUMENT QA
        # ====================================================

        if any(word in text for word in [

            "clinical study",
            "study",
            "brochure",
            "guideline",
            "guidelines",
            "document",
            "pdf",
            "cardiox",
            "heartcare",
            "neuroplus",
            "dosage",
            "side effects",
            "indication",
            "what does",
            "tell me about"

        ]):

            return DOCUMENT_QA

        # ====================================================
        # SEARCH HCP
        # ====================================================

        if any(word in text for word in [

            "find",
            "search",
            "doctor",
            "hospital",
            "hcp",
            "cardiologist",
            "physician",
            "specialist"

        ]):

            return SEARCH_HCP

        # ====================================================
        # NEXT BEST ACTION
        # ====================================================

        if any(word in text for word in [

            "next",
            "recommend",
            "recommendation",
            "suggest",
            "action",
            "should i do",
            "best action"

        ]):

            return NEXT_BEST_ACTION

        # ====================================================
        # FOLLOW UP
        # ====================================================

        if any(word in text for word in [

            "follow",
            "follow-up",
            "follow up",
            "schedule",
            "scheduled",
            "remind",
            "reminder",
            "visit again",
            "next visit",
            "next meeting",
            "after two weeks",
            "after 2 weeks",
            "after one month",
            "after 15 days",
            "after 30 days"

        ]):

            return FOLLOW_UP

        # ====================================================
        # DEFAULT
        # ====================================================

        return CHAT


intent_classifier = IntentClassifier()