from database import SessionLocal
from models import Interaction

from services.groq_service import groq_service
from services.session_memory import session_memory

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    NEXT_BEST_ACTION_PROMPT,
)


def next_best_action_tool(state: dict) -> dict:
    """
    Generates the next best action for the latest HCP.
    """

    db = SessionLocal()

    try:

        # --------------------------------------------------
        # Step 1 : Get HCP Name
        # --------------------------------------------------

        hcp_name = state.get("hcp_name")

        # Read from Session Memory
        if not hcp_name:

            session_id = state.get("session_id")

            if session_id:

                hcp_name = session_memory.get_value(
                    session_id,
                    "last_hcp"
                )

        # Last fallback → extract from message
        if not hcp_name:

            message = state["user_message"]

            words = message.split()

            if "Dr" in words:

                index = words.index("Dr")

                if index + 1 < len(words):

                    hcp_name = f"Dr {words[index + 1]}"

        if not hcp_name:

            return {
                "tool_result": {
                    "status": "error",
                    "message": "Unable to identify HCP."
                }
            }

        # --------------------------------------------------
        # Step 2 : Fetch Interaction History
        # --------------------------------------------------

        interactions = (
            db.query(Interaction)
            .filter(
                Interaction.hcp_name.ilike(f"%{hcp_name}%")
            )
            .all()
        )

        if not interactions:

            return {
                "tool_result": {
                    "status": "error",
                    "message": "No previous interactions found."
                }
            }

        # --------------------------------------------------
        # Step 3 : Build History
        # --------------------------------------------------

        history = ""

        for i, interaction in enumerate(interactions, start=1):

            history += (
                f"{i}. "
                f"{interaction.summary}\n"
            )

        # --------------------------------------------------
        # Step 4 : Ask Groq
        # --------------------------------------------------

        prompt = NEXT_BEST_ACTION_PROMPT.format(
            history=history
        )

        recommendation = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )

        # --------------------------------------------------
        # Step 5 : Return Result
        # --------------------------------------------------

        return {

            "tool_result": {

                "status": "success",

                "hcp_name": hcp_name,

                "history": history,

                "recommendation": recommendation

            }

        }

    except Exception as e:

        db.rollback()

        return {

            "tool_result": {

                "status": "error",

                "message": str(e)

            }

        }

    finally:

        db.close()