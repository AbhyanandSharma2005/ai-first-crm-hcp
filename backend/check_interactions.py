from database import SessionLocal
from models import Interaction

db = SessionLocal()

rows = db.query(Interaction).all()

print("Total:", len(rows))

for row in rows:
    print(
        row.id,
        row.hcp_name,
        row.product,
        row.summary,
        row.follow_up
    )

db.close()