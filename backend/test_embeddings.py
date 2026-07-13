from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.embeddings import generate_embeddings

documents = document_loader.load_documents(
    "rag/documents"
)

print("Documents Loaded:", len(documents))

chunks = document_splitter.split_documents(
    documents
)

print("Chunks Created:", len(chunks))

vectors = generate_embeddings(
    chunks
)

print("Embedding Shape:", vectors.shape)

if len(vectors) > 0:
    print(vectors[0][:10])