from database import SessionLocal
from models import HCP

db = SessionLocal()

hcps = db.query(HCP).all()

print(f"Total HCPs: {len(hcps)}")

for hcp in hcps:
    print(
        hcp.id,
        hcp.name,
        hcp.specialization,
        hcp.hospital
    )

db.close()