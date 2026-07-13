import os
import pickle

import faiss
import numpy as np

from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.embeddings import generate_embeddings


INDEX_DIR = "rag/faiss_index"

INDEX_FILE = os.path.join(
    INDEX_DIR,
    "index.faiss"
)

CHUNKS_FILE = os.path.join(
    INDEX_DIR,
    "chunks.pkl"
)


class VectorStore:

    def __init__(self):

        self.index = None

        self.chunks = []

    # -------------------------------------------------
    # Build Vector Store
    # -------------------------------------------------

    def build(self):

        print()

        print("Loading documents...")

        documents = document_loader.load_documents(
            "rag/documents"
        )

        print(
            f"Loaded {len(documents)} documents."
        )

        print()

        print("Splitting documents...")

        self.chunks = (
            document_splitter.split_documents(
                documents
            )
        )

        print(
            f"Created {len(self.chunks)} chunks."
        )

        print()

        print("Generating embeddings...")

        vectors = generate_embeddings(
            self.chunks
        )

        print(
            f"Generated {len(vectors)} embeddings."
        )

        dimension = vectors.shape[1]

        self.index = faiss.IndexFlatL2(
            dimension
        )

        self.index.add(
            np.array(
                vectors,
                dtype=np.float32
            )
        )

        print()

        print(
            f"FAISS Index Size: {self.index.ntotal}"
        )

    # -------------------------------------------------
    # Save
    # -------------------------------------------------

    def save(self):

        os.makedirs(
            INDEX_DIR,
            exist_ok=True
        )

        faiss.write_index(
            self.index,
            INDEX_FILE
        )

        with open(
            CHUNKS_FILE,
            "wb"
        ) as f:

            pickle.dump(
                self.chunks,
                f
            )

        print()

        print("Vector Store Saved.")

    # -------------------------------------------------
    # Load
    # -------------------------------------------------

    def load(self):

        self.index = faiss.read_index(
            INDEX_FILE
        )

        with open(
            CHUNKS_FILE,
            "rb"
        ) as f:

            self.chunks = pickle.load(f)

        print()

        print(
            f"Loaded Index ({self.index.ntotal} vectors)"
        )


vector_store = VectorStore()