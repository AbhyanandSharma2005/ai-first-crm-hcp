import numpy as np

from rag.vector_store import vector_store
from rag.embeddings import embed_query
from rag.bm25 import bm25_retriever


class Retriever:

    def __init__(self):

        self.vector_store = vector_store

        self.loaded = False

        self.distance_threshold = 1.2

    # --------------------------------------------------
    # Load FAISS
    # --------------------------------------------------

    def load(self):

        if not self.loaded:

            self.vector_store.load()

            self.loaded = True

    # --------------------------------------------------
    # Semantic Search (FAISS)
    # --------------------------------------------------

    def semantic_search(
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

                "content":
                document.page_content,

                "source":
                document.metadata.get(
                    "source",
                    "Unknown"
                ),

                "distance":
                float(distance)

            })

        return results

    # --------------------------------------------------
    # Hybrid Search (FAISS + BM25)
    # --------------------------------------------------

    def search(
        self,
        query,
        k=3
    ):

        semantic = self.semantic_search(
            query,
            k
        )

        keyword = bm25_retriever.search(
            query,
            k
        )

        merged = {}

        # Add semantic results first
        for item in semantic:

            merged[item["content"]] = item

        # Add BM25 results
        for item in keyword:

            merged[item["content"]] = item

        # -------------------------------
        # Debug Logs
        # -------------------------------

        print()

        print("========== HYBRID SEARCH ==========")

        print(f"Query: {query}")

        print()

        for i, item in enumerate(
            merged.values(),
            start=1
        ):

            print(f"Result {i}")

            print(
                f"Source : {item['source']}"
            )

            if "distance" in item:

                print(
                    f"Distance : {item['distance']:.4f}"
                )

            if "score" in item:

                print(
                    f"BM25 Score : {item['score']:.4f}"
                )

            print(
                f"Content Preview : {item['content'][:120]}..."
            )

            print("----------------------------------")

        print("===================================")

        return list(
            merged.values()
        )


retriever = Retriever()