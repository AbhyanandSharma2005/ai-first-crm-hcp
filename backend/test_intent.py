from services.intent_classifier import intent_classifier

messages = [

    "Met Dr Sharma today.",

    "Update today's interaction.",

    "Find cardiologists.",

    "What should I do next?",

    "Remind me after 15 days.",

    "Schedule next visit.",

    "Follow up with Dr Gupta on 2026-08-10."
]

for message in messages:

    print("=" * 60)

    print("Message:")

    print(message)

    print()

    print("Detected Intent:")

    print(intent_classifier.classify(message))