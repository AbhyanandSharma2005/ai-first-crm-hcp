import json


def parse_llm_json(response: str) -> dict:
    """
    Parses JSON returned by the LLM.
    """

    try:

        response = response.strip()

        if response.startswith("```json"):
            response = response.replace("```json", "")

        if response.endswith("```"):
            response = response[:-3]

        response = response.strip()

        return json.loads(response)

    except Exception:

        return {}