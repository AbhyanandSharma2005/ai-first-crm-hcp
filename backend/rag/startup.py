from pathlib import Path

from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.vector_store import vector_store


INDEX_FILE = "rag/faiss.index"


def initialize_rag():

    if Path(INDEX_FILE).exists():

        print("RAG index already exists.")

        return

    print("Creating RAG index...")

    documents = document_loader.load_documents(
        "rag/documents"
    )

    chunks = document_splitter.split_documents(
        documents
    )

    vector_store.build(chunks)

    print("RAG index created successfully.")