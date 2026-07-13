from database import SessionLocal
from models import Interaction


class DatabaseRetrieverAgent:

    def search_by_hcp(
        self,
        hcp_name: str
    ):

        db = SessionLocal()

        try:

            return (

                db.query(Interaction)

                .filter(
                    Interaction.hcp_name.ilike(
                        f"%{hcp_name}%"
                    )
                )

                .order_by(
                    Interaction.id.desc()
                )

                .all()

            )

        finally:

            db.close()

    def latest_interaction(
        self,
        hcp_name: str
    ):

        db = SessionLocal()

        try:

            return (

                db.query(Interaction)

                .filter(
                    Interaction.hcp_name.ilike(
                        f"%{hcp_name}%"
                    )
                )

                .order_by(
                    Interaction.id.desc()
                )

                .first()

            )

        finally:

            db.close()

    def all_interactions(self):

        db = SessionLocal()

        try:

            return (

                db.query(Interaction)

                .order_by(
                    Interaction.id.desc()
                )

                .all()

            )

        finally:

            db.close()

    def recent_interactions(
        self,
        limit=5
    ):

        db = SessionLocal()

        try:

            return (

                db.query(Interaction)

                .order_by(
                    Interaction.id.desc()
                )

                .limit(limit)

                .all()

            )

        finally:

            db.close()


database_agent = DatabaseRetrieverAgent()