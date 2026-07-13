from rag.loader import document_loader
from rag.splitter import document_splitter

docs = document_loader.load_documents()

chunks = document_splitter.split_documents(
    docs
)

print()

print("Total Chunks")

print(len(chunks))

print()

for chunk in chunks[:5]:

    print("=" * 50)

    print(chunk.metadata)

    print()

    print(chunk.page_content)

    print()