from services.groq_service import groq_service

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    INTERACTION_SUMMARY_PROMPT
)

from database import SessionLocal

from models import Interaction



def log_interaction_tool(state):

    message = state["message"]


    prompt = INTERACTION_SUMMARY_PROMPT.format(
        interaction=message
    )


    summary = groq_service.chat(

        system_prompt=SYSTEM_PROMPT,

        user_prompt=prompt

    )


    db = SessionLocal()


    try:

        interaction = Interaction(

            hcp_name="Unknown",

            summary=summary,

            product="Unknown"

        )


        db.add(interaction)

        db.commit()

        db.refresh(interaction)



        return {

            "tool_result":

            {

                "status":
                "success",

                "interaction_id":
                interaction.id,

                "summary":
                summary

            }

        }


    finally:

        db.close()