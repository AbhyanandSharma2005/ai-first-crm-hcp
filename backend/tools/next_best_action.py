from database import SessionLocal

from models import Interaction

from services.groq_service import groq_service

from prompts.next_best_action_prompt import (
    SYSTEM_PROMPT,
    NEXT_BEST_ACTION_PROMPT,
)


def next_best_action_tool(state: dict) -> dict:

    db = SessionLocal()

    try:

        hcp_name = state.get("hcp_name")
        
        if not hcp_name:

            hcp_name = state["conversation"].get(
                "last_hcp"
            )

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

        interactions = (

            db.query(Interaction)

            .filter(

                Interaction.hcp_name.ilike(
                    f"%{hcp_name}%"
                )

            )

            .all()

        )

        if not interactions:

            return {

                "tool_result": {

                    "status": "error",

                    "message":
                    "No previous interactions found."

                }

            }

        history = ""

        for i, interaction in enumerate(interactions, start=1):

            history += (

                f"{i}. "

                f"{interaction.summary}\n"

            )

        prompt = NEXT_BEST_ACTION_PROMPT.format(

            history=history

        )

        recommendation = groq_service.chat(

            system_prompt=SYSTEM_PROMPT,

            user_prompt=prompt

        )

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