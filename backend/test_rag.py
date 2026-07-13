from rag.pipeline import rag_pipeline


result = rag_pipeline.ask(
    "What are the side effects?"
)

print()

print("QUESTION")
print(result["question"])

print()

print("CONTEXT")

for chunk in result["context"]:

    print("------------------------------------")
    print(chunk)

print()

print("ANSWER")
print(result["answer"])