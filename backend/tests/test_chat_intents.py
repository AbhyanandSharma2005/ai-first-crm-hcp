from .conftest import client


def send(message):

    payload = {
        "session_id": "pytest",
        "message": message
    }

    response = client.post(
        "/chat/",
        json=payload
    )

    assert response.status_code == 200

    return response.json()


# --------------------------------------------------
# SEARCH_HCP
# --------------------------------------------------

def test_search_hcp():

    body = send("Find Dr Sharma")

    assert body["success"] is True
    assert body["data"]["intent"] == "SEARCH_HCP"


# --------------------------------------------------
# LOG_INTERACTION
# --------------------------------------------------

def test_log_interaction():

    body = send(
        "Met Dr Sharma today. Discussed CardioX. Follow up next week."
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "LOG_INTERACTION"


# --------------------------------------------------
# EDIT_INTERACTION
# --------------------------------------------------

def test_edit_interaction():

    body = send(
        "Update Dr Sharma interaction to include brochure discussion."
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "EDIT_INTERACTION"


# --------------------------------------------------
# NEXT_BEST_ACTION
# --------------------------------------------------

def test_next_best_action():

    body = send(
        "What should I do next for Dr Sharma?"
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "NEXT_BEST_ACTION"


# --------------------------------------------------
# CONVERSATION_MEMORY
# --------------------------------------------------

def test_conversation_memory():

    body = send(
        "What did we discuss with Dr Sharma?"
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "CONVERSATION_MEMORY"


# --------------------------------------------------
# DOCUMENT_QA
# --------------------------------------------------

def test_document_qa():

    body = send(
        "What does the CardioX clinical study say?"
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "DOCUMENT_QA"


# --------------------------------------------------
# FOLLOW_UP
# --------------------------------------------------

def test_follow_up():

    body = send(
        "Schedule a follow up with Dr Sharma next Monday."
    )

    assert body["success"] is True
    assert body["data"]["intent"] == "FOLLOW_UP"