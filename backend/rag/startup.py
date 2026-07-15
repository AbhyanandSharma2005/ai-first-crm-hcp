from pathlib import Path

from rag.vector_store import (
    vector_store,
    INDEX_FILE
)

from rag.bm25 import bm25_retriever


def initialize_rag():

    if Path(INDEX_FILE).exists():

        print("RAG index already exists.")

        vector_store.load()

    else:

        print("Creating RAG index...")

        vector_store.build()

        vector_store.save()

        print("RAG index created.")

    bm25_retriever.build()

    print("BM25 initialized.")