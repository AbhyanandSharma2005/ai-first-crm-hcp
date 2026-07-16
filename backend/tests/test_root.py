from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_root():

    response = client.get("/")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True

    assert body["message"] == "AI First CRM Backend Running"

    assert body["error"] is None

    assert body["data"]["service"] == "AI First CRM HCP API"

    assert body["data"]["version"] == "1.0.0"

    assert body["data"]["status"] == "Healthy"

    assert body["data"]["documentation"] == "/docs"