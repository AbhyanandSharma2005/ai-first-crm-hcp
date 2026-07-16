from pathlib import Path

from rag.vector_store import (
    vector_store,
    INDEX_FILE
)

from rag.bm25 import bm25_retriever


def initialize_rag():

    print("\n==============================")
    print("INITIALIZING RAG")
    print("==============================")

    if Path(INDEX_FILE).exists():

        print("RAG index already exists.")

        vector_store.load()

    else:

        print("Creating RAG index...")

        vector_store.build()

        vector_store.save()

        print("RAG index created.")

    print("\n==============================")
    print("BM25 INITIALIZATION")
    print("==============================")

    print("Startup BM25 Object ID :", id(bm25_retriever))
    print("Before Build           :", bm25_retriever.bm25)

    bm25_retriever.build()

    print("After Build            :", bm25_retriever.bm25)

    print("BM25 initialized.")

    print("==============================\n")