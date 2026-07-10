from services.groq_service import groq_service

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    INTERACTION_SUMMARY_PROMPT,
)

from database import SessionLocal

from models import Interaction


def log_interaction_tool(state: dict) -> dict:
    """
    Logs an interaction by:
    1. Summarizing the user message using Groq.
    2. Saving the summary to the database.
    3. Returning the created interaction details.
    """

    message = state["user_message"]

    prompt = INTERACTION_SUMMARY_PROMPT.format(
        interaction=message
    )

    db = SessionLocal()

    try:
        # Generate interaction summary using Groq
        summary = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )

        # Save interaction to the database
        interaction = Interaction(
            hcp_name="Unknown",
            summary=summary,
            product="Unknown"
        )

        db.add(interaction)
        db.commit()
        db.refresh(interaction)

        return {
            "tool_result": {
                "status": "success",
                "interaction_id": interaction.id,
                "summary": summary
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