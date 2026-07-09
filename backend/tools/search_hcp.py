from database import SessionLocal

from models import HCP



def search_hcp_tool(state):


    keyword = state["message"]


    db = SessionLocal()


    try:


        results = (

            db.query(HCP)

            .filter(
                HCP.specialization.ilike(
                    "%cardio%"
                )
            )

            .all()

        )



        doctors = []


        for doctor in results:

            doctors.append(

                {

                    "name":
                    doctor.name,


                    "hospital":
                    doctor.hospital,


                    "specialization":
                    doctor.specialization

                }

            )



        return {


            "tool_result":

            {

                "status":
                "success",

                "hcp":
                doctors

            }

        }


    finally:

        db.close()