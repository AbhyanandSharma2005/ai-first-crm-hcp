from database import SessionLocal
from models import HCP


db = SessionLocal()


hcp_list = [

    HCP(
        name="Dr Sharma",
        specialization="Cardiology",
        hospital="Apollo Hospital"
    ),


    HCP(
        name="Dr Mehta",
        specialization="Cardiology",
        hospital="AIIMS Delhi"
    ),


    HCP(
        name="Dr Gupta",
        specialization="Neurology",
        hospital="Fortis Hospital"
    )

]


db.add_all(hcp_list)

db.commit()

db.close()


print("HCP data inserted successfully")