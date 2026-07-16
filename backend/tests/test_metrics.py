from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_metrics():

    response = client.get("/metrics")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True

    assert body["message"] == "Application metrics."

    assert body["error"] is None

    assert body["data"]["status"] == "Running"

    assert body["data"]["environment"] == "Development"

    assert body["data"]["api"] == "AI First CRM HCP API"

    assert body["data"]["version"] == "1.0.0"