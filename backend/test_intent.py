from services.intent_classifier import intent_classifier

messages = [

    "Met Dr Sharma today.",

    "Update the follow up.",

    "Find cardiologists.",

    "What should I do next for Dr Sharma?",

    "Remind me after two weeks.",

    "Schedule next visit."
]

for msg in messages:

    print("=" * 50)

    print(msg)

    print(intent_classifier.classify(msg))