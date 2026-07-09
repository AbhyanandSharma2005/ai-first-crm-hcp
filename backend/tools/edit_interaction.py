from database import SessionLocal

from models import Interaction



def edit_interaction_tool(state):


    db = SessionLocal()


    try:

        interaction = (
            db.query(Interaction)
            .first()
        )


        if not interaction:

            return {

                "tool_result":

                {
                    "status":
                    "failed",

                    "message":
                    "No interaction found"
                }

            }



        interaction.summary = (
            state["message"]
        )


        db.commit()



        return {

            "tool_result":

            {

                "status":
                "success",

                "message":
                "Interaction updated"

            }

        }


    finally:

        db.close()