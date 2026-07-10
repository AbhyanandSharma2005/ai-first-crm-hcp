from database import SessionLocal
from models import Interaction


def edit_interaction_tool(state: dict) -> dict:

    db = SessionLocal()

    try:

        interaction_id = state.get(
            "interaction_id"
        )

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


        interaction.summary = (
            state.get("summary")
            or interaction.summary
        )


        db.commit()

        db.refresh(interaction)


        return {

            "tool_result": {

                "status": "success",

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
                "status":"error",
                "message":str(e)
            }
        }


    finally:

        db.close()