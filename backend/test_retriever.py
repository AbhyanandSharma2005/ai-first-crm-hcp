from rag.retriever import retriever


results = retriever.search(

    "clinical study",

    k=3

)

print()

print("=" * 60)

for text in results:

    print()

    print(text)

    print()