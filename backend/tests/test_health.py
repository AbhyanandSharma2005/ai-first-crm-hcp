from .conftest import client


def test_home():

    response = client.get("/")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True


def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    body = response.json()

    assert body["data"]["status"] == "UP"


def test_version():

    response = client.get("/version")

    assert response.status_code == 200

    body = response.json()

    assert body["data"]["version"] == "1.0.0"