from database import SessionLocal
from models import HCP


def search_hcp_tool(state):

    db = SessionLocal()

    query = state["user_message"]


    results = (
        db.query(HCP)
        .filter(
            HCP.specialization.ilike(
                f"%{query}%"
            )
        )
        .all()
    )


    return {

        "tool_result":{

            "status":"success",

            "hcp":[

                {
                    "name":hcp.name,
                    "hospital":hcp.hospital,
                    "specialization":
                    hcp.specialization
                }

                for hcp in results

            ]

        }

    }