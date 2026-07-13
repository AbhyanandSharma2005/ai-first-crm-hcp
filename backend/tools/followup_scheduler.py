from datetime import datetime

from database import SessionLocal
from models import Interaction

from services.groq_service import groq_service
from services.json_parser import parse_llm_json
from services.session_memory import session_memory

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    FOLLOW_UP_PROMPT,
)


def follow_up_scheduler_tool(state: dict) -> dict:
    """
    Schedule or update a follow-up.

    If the user doesn't mention the HCP name,
    the last HCP stored in Session Memory is used.
    """

    message = state["user_message"]

    prompt = FOLLOW_UP_PROMPT.format(
        message=message
    )

    db = SessionLocal()

    try:

        response = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )

        print("\n========== GROQ RESPONSE ==========")
        print(response)
        print("===================================\n")

        data = parse_llm_json(response)

        session_id = state.get("session_id")

        # ----------------------------------------------------
        # Extract HCP
        # ----------------------------------------------------

        hcp_name = data.get(
            "hcp_name",
            ""
        ).strip()

        print("LLM extracted HCP:", hcp_name)

        if not hcp_name and session_id:

            print("Using Session Memory...")

            hcp_name = session_memory.get_value(
                session_id,
                "last_hcp"
            )

            if hcp_name:
                hcp_name = hcp_name.strip()

        print("Final HCP:", hcp_name)

        # ----------------------------------------------------
        # Extract Follow-up Date
        # ----------------------------------------------------

        follow_up_str = data.get(
            "follow_up",
            ""
        ).strip()

        if not hcp_name:

            return {
                "tool_result": {
                    "status": "error",
                    "message": "No HCP name found."
                }
            }

        if not follow_up_str:

            return {
                "tool_result": {
                    "status": "error",
                    "message": "No follow-up date found."
                }
            }

        try:

            follow_up_date = datetime.strptime(
                follow_up_str,
                "%Y-%m-%d"
            ).date()

        except ValueError:

            return {
                "tool_result": {
                    "status": "error",
                    "message": "Invalid follow-up date format."
                }
            }

        # ----------------------------------------------------
        # Find Latest Interaction
        # ----------------------------------------------------

        interaction = (
            db.query(Interaction)
            .filter(
                Interaction.hcp_name.ilike(
                    f"%{hcp_name}%"
                )
            )
            .order_by(
                Interaction.id.desc()
            )
            .first()
        )

        if interaction is None:

            return {
                "tool_result": {
                    "status": "error",
                    "message": f"No interaction found for {hcp_name}."
                }
            }

        # ----------------------------------------------------
        # Update Database
        # ----------------------------------------------------

        interaction.follow_up = follow_up_date

        db.commit()

        db.refresh(interaction)

        # ----------------------------------------------------
        # Update Session Memory
        # ----------------------------------------------------

        if session_id:

            session_memory.set_value(
                session_id,
                "last_hcp",
                interaction.hcp_name
            )

            session_memory.set_value(
                session_id,
                "last_follow_up",
                str(interaction.follow_up)
            )

        # ----------------------------------------------------
        # Return Success
        # ----------------------------------------------------

        return {

            "tool_result": {

                "status": "success",

                "interaction_id": interaction.id,

                "hcp_name": interaction.hcp_name,

                "follow_up": str(
                    interaction.follow_up
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