from datetime import datetime

from services.groq_service import groq_service
from services.json_parser import parse_llm_json

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    ENTITY_EXTRACTION_PROMPT,
)

from database import SessionLocal
from models import Interaction


def log_interaction_tool(state: dict) -> dict:
    """
    Logs a new interaction.

    Flow:
        User Message
              ↓
        Groq extracts structured JSON
              ↓
        Parse JSON
              ↓
        Save Interaction to Database
              ↓
        Return structured response
    """

    message = state["user_message"]

    prompt = ENTITY_EXTRACTION_PROMPT.format(
        interaction=message
    )

    db = SessionLocal()

    try:

        # ---------------------------------------
        # Call Groq
        # ---------------------------------------

        response = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )

        print("\n========== GROQ RESPONSE ==========")
        print(response)
        print("===================================\n")

        # ---------------------------------------
        # Parse JSON
        # ---------------------------------------

        data = parse_llm_json(response)
        
        print("\n========== PARSED DATA ==========")
        print(data)
        print("=================================")

        hcp_name = data.get(
            "hcp_name",
            ""
        ).strip()

        product = data.get(
            "product",
            ""
        ).strip()

        summary = data.get(
            "summary",
            ""
        ).strip()

        follow_up_str = data.get(
            "follow_up",
            ""
        ).strip()

        # ---------------------------------------
        # Convert Follow-up Date
        # ---------------------------------------

        follow_up = None

        if follow_up_str:

            try:

                follow_up = datetime.strptime(
                    follow_up_str,
                    "%Y-%m-%d"
                ).date()

            except ValueError:

                follow_up = None

        # ---------------------------------------
        # Save Interaction
        # ---------------------------------------
        print("\n========== BEFORE DATABASE SAVE ==========")
        print("hcp_name:", hcp_name)
        print("product:", product)
        print("summary:", summary)
        print("follow_up:", follow_up)
        print("==========================================")

        interaction = Interaction(

            hcp_name=hcp_name if hcp_name else "Unknown",

            product=product if product else "Unknown",

            summary=summary,

            follow_up=follow_up

        )

        db.add(interaction)

        db.commit()

        db.refresh(interaction)

        # ---------------------------------------
        # Return Complete Tool Result
        # ---------------------------------------

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