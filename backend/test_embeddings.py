from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.embeddings import generate_embeddings

documents = document_loader.load_documents("documents")

print("Documents Loaded:", len(documents))

if documents:
    print("First document preview:")
    print(documents[0].page_content[:300])

chunks = document_splitter.split_documents(documents)

print("Chunks Created:", len(chunks))

if chunks:
    print("First chunk preview:")
    print(chunks[0].page_content[:300])

vectors = generate_embeddings(chunks)

print("Embedding Shape:", vectors.shape)

if len(vectors) > 0:
    print(vectors[0][:10])