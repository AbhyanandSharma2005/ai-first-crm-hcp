from database import SessionLocal
from models import HCP


def search_hcp_tool(state: dict) -> dict:
    """
    Search HCPs by:
    - Name
    - Hospital
    - Specialization
    """

    db = SessionLocal()

    try:

        message = state["user_message"].lower()

        # --------------------------------------------------
        # Remove common command words
        # --------------------------------------------------

        keywords = (
            message
            .replace("find", "")
            .replace("search", "")
            .replace("show", "")
            .replace("list", "")
            .replace("doctor", "")
            .replace("doctors", "")
            .replace("hcp", "")
            .replace("physician", "")
            .strip()
        )

        # --------------------------------------------------
        # Normalize common specializations
        # --------------------------------------------------

        specialization_map = {
            "cardiologists": "cardiology",
            "cardiologist": "cardiology",
            "neurologists": "neurology",
            "neurologist": "neurology",
            "oncologists": "oncology",
            "oncologist": "oncology",
            "dermatologists": "dermatology",
            "dermatologist": "dermatology",
        }

        keywords = specialization_map.get(keywords, keywords)

        results = (

            db.query(HCP)

            .filter(

                (HCP.name.ilike(f"%{keywords}%"))

                |

                (HCP.hospital.ilike(f"%{keywords}%"))

                |

                (HCP.specialization.ilike(f"%{keywords}%"))

            )

            .all()

        )

        doctors = []

        for doctor in results:

            doctors.append({

                "id": doctor.id,

                "name": doctor.name,

                "specialization": doctor.specialization,

                "hospital": doctor.hospital

            })

        return {

            "tool_result": {

                "status": "success",

                "hcp": doctors

            }

        }

    except Exception as e:

        return {

            "tool_result": {

                "status": "error",

                "message": str(e)

            }

        }

    finally:

        db.close()