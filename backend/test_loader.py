from rag.loader import document_loader

docs = document_loader.load_documents()

print()

print("Documents Loaded")

print(len(docs))

print()

for doc in docs:

    print("=" * 50)

    print(doc.metadata)

    print()

    print(doc.page_content[:500])

    print()