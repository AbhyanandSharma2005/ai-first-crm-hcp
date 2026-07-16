from .conftest import client


def test_home():

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


def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["message"] == "Application is healthy."
    assert body["error"] is None

    assert body["data"]["status"] == "UP"


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