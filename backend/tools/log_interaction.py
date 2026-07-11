from datetime import datetime

from services.groq_service import groq_service

from prompts.interaction_extraction_prompt import (
    SYSTEM_PROMPT,
    INTERACTION_EXTRACTION_PROMPT,
)

from services.json_parser import parse_llm_json

from database import SessionLocal

from models import Interaction


def log_interaction_tool(state: dict) -> dict:
    """
    Logs an interaction by:
    1. Extracting structured information using Groq.
    2. Saving the interaction to PostgreSQL.
    3. Returning the created interaction details.
    """

    message = state["user_message"]

    prompt = INTERACTION_EXTRACTION_PROMPT.format(
        interaction=message
    )

    db = SessionLocal()

    try:

        # -----------------------------------------
        # Generate structured JSON using Groq
        # -----------------------------------------

        response = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )
        
        print("\n========== GROQ RESPONSE ==========")
        print(response)
        print("===================================\n")

        # -----------------------------------------
        # Parse JSON returned by Groq
        # -----------------------------------------

        data = parse_llm_json(response)

        # -----------------------------------------
        # Convert follow-up date
        # -----------------------------------------

        follow_up = None

        follow_up_str = data.get("follow_up")

        if follow_up_str:

            try:

                follow_up = datetime.strptime(
                    follow_up_str,
                    "%Y-%m-%d"
                ).date()

            except ValueError:

                follow_up = None

        # -----------------------------------------
        # Save interaction
        # -----------------------------------------

        interaction = Interaction(

            hcp_name=data.get(
                "hcp_name",
                "Unknown"
            ),

            product=data.get(
                "product",
                "Unknown"
            ),

            summary=data.get(
                "summary",
                ""
            ),

            follow_up=follow_up

        )

        db.add(interaction)

        db.commit()

        db.refresh(interaction)

        # -----------------------------------------
        # Return tool result
        # -----------------------------------------

        return {

            "tool_result": {

                "status": "success",

                "interaction_id": interaction.id,

                "hcp_name": interaction.hcp_name,

                "product": interaction.product,

                "summary": interaction.summary,

                "follow_up": (
                    interaction.follow_up.isoformat()
                    if interaction.follow_up
                    else None
                )

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