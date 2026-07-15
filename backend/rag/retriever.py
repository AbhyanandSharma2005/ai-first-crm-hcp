import numpy as np

from rag.vector_store import vector_store
from rag.embeddings import embed_query


class Retriever:

    def __init__(self):

        self.vector_store = vector_store

        self.loaded = False

        # Lower L2 distance = better match
        self.distance_threshold = 1.20

    def load(self):

        if not self.loaded:

            self.vector_store.load()

            self.loaded = True

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

        results = []

        for distance, index in zip(
            distances[0],
            indices[0]
        ):

            if index == -1:
                continue

            if distance > self.distance_threshold:
                continue

            document = self.vector_store.chunks[index]

            results.append({

                "content": document.page_content,

                "source": document.metadata.get(
                    "source",
                    "Unknown"
                ).split("\\")[-1].split("/")[-1],

                "distance": round(float(distance), 4)

            })

        print("\n========== RETRIEVAL ==========")

        if not results:

            print("No relevant documents found.")

        else:

            for item in results:

                print(
                    f"{item['source']} "
                    f"(distance={item['distance']})"
                )

        print("===============================\n")

        return results


retriever = Retriever()