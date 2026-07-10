from services.intent_classifier import intent_classifier


messages = [

    "Log today's meeting with Dr Sharma",

    "Update yesterday's interaction",

    "Find cardiologists in Apollo Hospital",

    "What should I do next for Dr Mehta?",

    "Show overdue follow ups",

    "Hello how are you?"

]

print("=" * 60)

print("INTENT CLASSIFIER TEST")

print("=" * 60)

for msg in messages:

    print("\nUser Message:")

    print(msg)

    intent = intent_classifier.classify(msg)

    print("Detected Intent:")

    print(intent)