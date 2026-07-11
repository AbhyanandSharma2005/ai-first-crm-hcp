from datetime import datetime

from database import SessionLocal
from models import Interaction

from services.groq_service import groq_service
from services.json_parser import parse_llm_json

from prompts.follow_up_prompt import FOLLOW_UP_PROMPT
from prompts.interaction_prompt import SYSTEM_PROMPT


def follow_up_scheduler_tool(state: dict) -> dict:
    """
    Schedules or updates a follow-up for an HCP.

    Flow:
    User Message
        ↓
    Groq extracts HCP + follow-up date
        ↓
    Parse JSON
        ↓
    Update latest interaction in DB
        ↓
    Return response
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

        hcp_name = data.get("hcp_name", "").strip()

        follow_up_str = data.get("follow_up", "").strip()

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

        interaction = (
            db.query(Interaction)
            .filter(
                Interaction.hcp_name.ilike(f"%{hcp_name}%")
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

        interaction.follow_up = follow_up_date

        db.commit()

        db.refresh(interaction)

        return {

            "tool_result": {

                "status": "success",

                "interaction_id": interaction.id,

                "hcp_name": interaction.hcp_name,

                "follow_up": str(interaction.follow_up)

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