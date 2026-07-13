import numpy as np

from rag.vector_store import vector_store
from rag.embeddings import embed_query


class Retriever:

    def __init__(self):

        self.vector_store = vector_store

        self.loaded = False

    # --------------------------------------------------
    # Load FAISS once
    # --------------------------------------------------

    def load(self):

        if not self.loaded:

            self.vector_store.load()

            self.loaded = True

    # --------------------------------------------------
    # Search
    # --------------------------------------------------

    def search(
        self,
        query,
        k=3
    ):

        self.load()

        query_vector = embed_query(query)

        query_vector = np.array(
            [query_vector],
            dtype=np.float32
        )

        distances, indices = self.vector_store.index.search(
            query_vector,
            k
        )

        context = []

        for index in indices[0]:

            if index == -1:
                continue

            context.append(
                self.vector_store.chunks[index].page_content
            )

        return context


retriever = Retriever()