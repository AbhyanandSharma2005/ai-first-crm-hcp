from database import SessionLocal
from models import Interaction


def edit_interaction_tool(state: dict) -> dict:
    """
    Updates existing interaction details.
    """

    db = SessionLocal()

    try:

        interaction_id = state.get(
            "interaction_id"
        )


        if not interaction_id:

            return {

                "tool_result": {

                    "status": "error",

                    "message":
                    "Interaction ID missing"

                }

            }



        interaction = (
            db.query(Interaction)
            .filter(
                Interaction.id == interaction_id
            )
            .first()
        )


        if not interaction:

            return {

                "tool_result": {

                    "status": "error",

                    "message":
                    "Interaction not found"

                }

            }



        if state.get("summary"):

            interaction.summary = (
                state["summary"]
            )


        if state.get("product"):

            interaction.product = (
                state["product"]
            )


        if state.get("follow_up"):

            interaction.follow_up = (
                state["follow_up"]
            )


        db.commit()

        db.refresh(interaction)



        return {

            "tool_result": {

                "status":
                "success",

                "interaction_id":
                interaction.id,

                "summary":
                interaction.summary

            }

        }



    except Exception as e:

        db.rollback()

        return {

            "tool_result": {

                "status":
                "error",

                "message":
                str(e)

            }

        }



    finally:

        db.close()