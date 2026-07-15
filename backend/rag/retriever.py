import numpy as np

from rag.vector_store import vector_store
from rag.embeddings import embed_query


class Retriever:

    def __init__(self):

        self.vector_store = vector_store

        self.loaded = False

        # Maximum acceptable L2 distance
        self.distance_threshold = 1.20

    # --------------------------------------------------
    # Load FAISS
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
        
        print("\n========== RETRIEVAL ==========")

        for item in results:

            print(
                f"Distance: {item['distance']:.4f}"
            )

            print(
                f"Source: {item['source']}"
            )

            print("===============================\n")

        results = []

        for distance, index in zip(
            distances[0],
            indices[0]
        ):

            if index == -1:
                continue

            # Ignore weak matches
            if distance > self.distance_threshold:
                continue

            document = self.vector_store.chunks[index]

            results.append({

                "content": document.page_content,

                "source": document.metadata.get(
                    "source",
                    "Unknown Document"
                ),

                "distance": float(distance)

            })
        
        print("\n========== RETRIEVAL ==========")

        for item in results:

            print(
                f"Distance: {item['distance']:.4f}"
            )

            print(
                f"Source: {item['source']}"
            )

            print("===============================\n")

        return results


retriever = Retriever()