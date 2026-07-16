from .conftest import client


def test_chat_document_qa():

    payload = {

        "session_id": "pytest",

        "message": "What does the CardioX clinical study say?"

    }

    response = client.post(

        "/chat/",

        json=payload

    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True

    assert "response" in body["data"]


def test_chat_empty_message():

    payload = {

        "session_id": "pytest",

        "message": ""

    }

    response = client.post(

        "/chat/",

        json=payload

    )

    assert response.status_code == 422 or response.status_code == 400