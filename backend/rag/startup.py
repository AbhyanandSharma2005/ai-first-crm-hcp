from pathlib import Path

from rag.vector_store import (
    vector_store,
    INDEX_FILE,
)


def initialize_rag():
    """
    Initialize the FAISS index on application startup.
    """

    if Path(INDEX_FILE).exists():

        print("RAG index already exists.")

        return

    print("Creating RAG index...")

    vector_store.build()

    vector_store.save()

    print("RAG index created successfully.")