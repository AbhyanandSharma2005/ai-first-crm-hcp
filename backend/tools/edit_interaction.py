from datetime import datetime

from database import SessionLocal
from models import Interaction

from services.groq_service import groq_service
from services.json_parser import parse_llm_json

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    EDIT_INTERACTION_PROMPT,
)

from services.session_memory import session_memory


def edit_interaction_tool(state: dict) -> dict:
    """
    Edits the latest interaction of an HCP.

    Flow:
        User Message
            ↓
        Get HCP from LLM or Session Memory
            ↓
        Find latest interaction
            ↓
        Ask Groq for updated fields
            ↓
        Update database
            ↓
        Return updated interaction
    """

    db = SessionLocal()

    try:

        session_id = state.get("session_id")
        message = state["user_message"]

        # ---------------------------------------------------
        # Get HCP from state/session memory
        # ---------------------------------------------------

        hcp_name = state.get("hcp_name")

        if not hcp_name and session_id:
            hcp_name = session_memory.get_value(
                session_id,
                "last_hcp"
            )

        if not hcp_name:
            return {
                "tool_result": {
                    "status": "error",
                    "message": "No HCP selected."
                }
            }

        # ---------------------------------------------------
        # Fetch latest interaction
        # ---------------------------------------------------

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

        # ---------------------------------------------------
        # Build prompt
        # ---------------------------------------------------

        old_interaction = f"""
HCP Name: {interaction.hcp_name}
Product: {interaction.product}
Summary: {interaction.summary}
Follow-up: {interaction.follow_up}
"""

        prompt = EDIT_INTERACTION_PROMPT.format(
            old_interaction=old_interaction,
            edit_request=message
        )

        # ---------------------------------------------------
        # Ask Groq
        # ---------------------------------------------------

        response = groq_service.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt
        )

        print("\n========== GROQ RESPONSE ==========")
        print(response)
        print("===================================\n")

        data = parse_llm_json(response)

        # ---------------------------------------------------
        # Update HCP
        # ---------------------------------------------------

        interaction.hcp_name = data.get(
            "hcp_name",
            interaction.hcp_name
        )

        # ---------------------------------------------------
        # Update Product
        # ---------------------------------------------------

        interaction.product = data.get(
            "product",
            interaction.product
        )

        # ---------------------------------------------------
        # Update Summary
        # ---------------------------------------------------

        interaction.summary = data.get(
            "summary",
            interaction.summary
        )

        # ---------------------------------------------------
        # Update Follow-up
        # ---------------------------------------------------

        follow_up = interaction.follow_up

        follow_up_str = data.get(
            "follow_up"
        )

        if follow_up_str:

            try:

                follow_up = datetime.strptime(
                    follow_up_str,
                    "%Y-%m-%d"
                ).date()

            except ValueError:
                pass

        interaction.follow_up = follow_up

        # ---------------------------------------------------
        # Save
        # ---------------------------------------------------

        db.commit()

        db.refresh(interaction)

        # ---------------------------------------------------
        # Return
        # ---------------------------------------------------

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