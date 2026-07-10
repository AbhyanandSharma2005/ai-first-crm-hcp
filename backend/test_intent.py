from services.intent_classifier import intent_classifier


messages = [

    "Log today's meeting with Dr Sharma.",

    "Update Dr Sharma interaction and add brochure discussion.",

    "Find cardiologists in Apollo Hospital.",

    "What should I do next for Dr Sharma?",

    "Show overdue follow-ups.",

    "Hello, how are you?"

]


for msg in messages:

    print(
        msg,
        "---->",
        intent_classifier.classify(msg)
    )