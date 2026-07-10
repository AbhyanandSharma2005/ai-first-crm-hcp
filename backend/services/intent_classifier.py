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


            # Clean LLM response
            intent = (
                intent
                .replace(".", "")
                .replace("`", "")
                .replace('"', "")
                .replace("'", "")
            )


            # Remove extra text
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
        Rule based fallback classifier.
        """

        text = message.lower()



        # ====================================================
        # 1. EDIT INTERACTION
        # Highest priority
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
        # 2. LOG INTERACTION
        # ====================================================

        if any(word in text for word in [

            "log",
            "save",
            "record",
            "visited",
            "met",
            "meeting",
            "interaction"

        ]):

            return LOG_INTERACTION



        # ====================================================
        # 3. SEARCH HCP
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
        # 4. NEXT BEST ACTION
        # ====================================================

        if any(word in text for word in [

            "next",
            "recommend",
            "recommendation",
            "suggest",
            "action",
            "should i do"

        ]):

            return NEXT_BEST_ACTION



        # ====================================================
        # 5. FOLLOW UP
        # ====================================================

        if any(word in text for word in [

            "follow",
            "follow-up",
            "schedule",
            "remind",
            "reminder",
            "due",
            "overdue"

        ]):

            return FOLLOW_UP



        # ====================================================
        # 6. CHAT
        # ====================================================

        return CHAT



# Singleton instance

intent_classifier = IntentClassifier()