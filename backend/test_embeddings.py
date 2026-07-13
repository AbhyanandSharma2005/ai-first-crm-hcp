from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.embeddings import generate_embeddings


documents = document_loader.load_documents(
    "documents"
)

chunks = document_splitter.split_documents(
    documents
)

vectors = generate_embeddings(
    chunks
)

print()

print("Number of Chunks:", len(chunks))

print("Embedding Shape:", vectors.shape)

print()

print(vectors[0][:10])