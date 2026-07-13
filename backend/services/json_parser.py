import json


def parse_llm_json(response: str) -> dict:
    """
    Parses JSON returned by the LLM.
    """

    try:

        response = response.strip()

        # Remove markdown code fences
        if "```" in response:

            response = (
                response
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(response)

    except Exception as e:

        print("\nJSON PARSE ERROR")
        print(e)
        print("RAW RESPONSE:")
        print(response)

        return {}