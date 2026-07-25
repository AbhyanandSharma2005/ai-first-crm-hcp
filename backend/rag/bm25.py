import pickle

from rank_bm25 import BM25Okapi

from rag.loader import document_loader
from rag.splitter import split_documents


BM25_INDEX_FILE = "rag/faiss_index/bm25_index.pkl"


class BM25Retriever:

    def __init__(self):
        self.bm25 = None
        self.chunks = []

    # -------------------------------------------------
    # Build
    # -------------------------------------------------

    def build(self):
        print("\n================================")
        print("BM25 BUILD STARTED")
        print("================================")

        documents = document_loader.load_documents(
            "rag/documents"
        )
        print(f"Loaded Documents : {len(documents)}")

        self.chunks = split_documents(documents)
        print(f"Document Chunks : {len(self.chunks)}")

        tokenized_corpus = [
            doc.page_content.lower().split()
            for doc in self.chunks
        ]
        print(f"Tokenized Chunks : {len(tokenized_corpus)}")

        if len(tokenized_corpus) == 0:
            print("ERROR: No documents available to build BM25.")
            return

        self.bm25 = BM25Okapi(tokenized_corpus)

        print("================================")
        print("BM25 BUILD SUCCESS")
        print("================================")

    def search(self, query, k=3):
        print("\n================================")
        print("BM25 SEARCH")
        print("Query     :", query)
        print("================================")

        if self.bm25 is None:
            print("ERROR: BM25 index has NOT been initialized!")
            raise RuntimeError(
                "BM25Retriever.build() was never called or failed."
            )

        tokens = query.lower().split()
        scores = self.bm25.get_scores(tokens)

        ranked = sorted(
            zip(scores, self.chunks),
            reverse=True,
            key=lambda x: x[0]
        )

        results = []
        for score, document in ranked[:k]:
            results.append({
                "content": document.page_content,
                "source": document.metadata.get("source", "Unknown"),
                "score": float(score)
            })

        print(f"Returned {len(results)} BM25 results.")
        return results

    # -------------------------------------------------
    # Save
    # -------------------------------------------------

    def save(self):
        with open(BM25_INDEX_FILE, "wb") as f:
            pickle.dump({
                "bm25": self.bm25,
                "chunks": self.chunks
            }, f)

    # -------------------------------------------------
    # Load
    # -------------------------------------------------

    def load(self):
        with open(BM25_INDEX_FILE, "rb") as f:
            data = pickle.load(f)
            self.bm25 = data["bm25"]
            self.chunks = data["chunks"]


bm25_retriever = BM25Retriever()