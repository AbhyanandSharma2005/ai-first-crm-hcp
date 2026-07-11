from database import SessionLocal
from models import Interaction

db = SessionLocal()

rows = db.query(Interaction).all()

for row in rows:

    print(row.id)

    print(row.hcp_name)

    print(row.product)

    print(row.summary)

    print(row.follow_up)

    print("-------------------------")

db.close()