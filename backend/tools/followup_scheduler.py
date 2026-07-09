from datetime import datetime, timedelta



def followup_scheduler_tool(state):


    days = 7


    followup_date = (

        datetime.now()

        +
        timedelta(days=days)

    )


    return {


        "tool_result":

        {

            "status":
            "scheduled",

            "date":
            str(
                followup_date.date()
            )

        }

    }