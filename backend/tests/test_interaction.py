from .conftest import client


def test_create_interaction():

    payload = {

        "hcp_name": "Dr Sharma",

        "summary": "Discussed CardioX clinical study.",

        "product": "CardioX",

        "follow_up": "2026-08-15"

    }

    response = client.post(

        "/interaction/",

        json=payload

    )

    assert response.status_code == 201

    body = response.json()

    assert body["success"] is True

    assert body["data"]["hcp_name"] == "Dr Sharma"


def test_get_interactions():

    response = client.get("/interaction/")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True