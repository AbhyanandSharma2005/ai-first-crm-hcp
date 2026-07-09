"""
Test script for Groq LLM Integration

Run using:

python test_groq.py
"""

from services.groq_service import groq_service

from prompts.interaction_prompt import (
    SYSTEM_PROMPT,
    INTERACTION_SUMMARY_PROMPT,
    ENTITY_EXTRACTION_PROMPT,
    NEXT_BEST_ACTION_PROMPT,
    CHAT_PROMPT,
)


def separator(title: str):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def test_summary():

    separator("TEST 1 : INTERACTION SUMMARY")

    interaction = """
Met Dr. Sharma at Apollo Hospital today.

Discussed CardioX and its latest clinical trial results.

Doctor showed interest in prescribing CardioX for cardiac patients.

Requested dosage guidelines.

Follow-up after two weeks.
"""

    prompt = INTERACTION_SUMMARY_PROMPT.format(
        interaction=interaction
    )

    response = groq_service.chat(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=prompt
    )

    print(response)


def test_entity_extraction():

    separator("TEST 2 : ENTITY EXTRACTION")

    interaction = """
Visited Dr. Mehta.

Hospital: AIIMS Delhi

Specialization: Cardiologist

Discussed CardioX.

Doctor requested brochure.

Follow-up after 10 days.
"""

    prompt = ENTITY_EXTRACTION_PROMPT.format(
        interaction=interaction
    )

    response = groq_service.chat(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=prompt
    )

    print(response)


def test_next_best_action():

    separator("TEST 3 : NEXT BEST ACTION")

    history = """
Previous Meeting:

Doctor was interested in CardioX.

Requested clinical trial data.

No follow-up has happened for 45 days.
"""

    prompt = NEXT_BEST_ACTION_PROMPT.format(
        history=history
    )

    response = groq_service.chat(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=prompt
    )

    print(response)


def test_chat():

    separator("TEST 4 : GENERAL CHAT")

    prompt = CHAT_PROMPT.format(
        message="How should I prepare for my next meeting with a cardiologist?"
    )

    response = groq_service.chat(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=prompt
    )

    print(response)


def main():

    print("\n")
    print("=" * 70)
    print("AI FIRST CRM - GROQ INTEGRATION TEST")
    print("=" * 70)

    try:

        print("\nGroq Health Check")
        print(groq_service.health_check())

        test_summary()

        test_entity_extraction()

        test_next_best_action()

        test_chat()

        separator("ALL TESTS COMPLETED SUCCESSFULLY")

    except Exception as e:

        separator("ERROR")

        print(str(e))


if __name__ == "__main__":
    main()