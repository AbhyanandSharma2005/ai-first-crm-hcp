from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_version():

    response = client.get("/version")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True

    assert body["message"] == "Version information."

    assert body["error"] is None

    assert body["data"]["version"] == "1.0.0"

    assert body["data"]["framework"] == "FastAPI"

    assert body["data"]["python"] == "3.13"