from rank_bm25 import BM25Okapi

from rag.loader import document_loader
from rag.splitter import document_splitter


class BM25Retriever:

    def __init__(self):

        self.documents = []

        self.tokenized = []

        self.bm25 = None

    def build(self):

        documents = document_loader.load_documents(
            "rag/documents"
        )

        self.documents = (
            document_splitter.split_documents(
                documents
            )
        )

        self.tokenized = [

            doc.page_content.lower().split()

            for doc in self.documents

        ]

        self.bm25 = BM25Okapi(
            self.tokenized
        )

        print()

        print(
            f"BM25 Index Built ({len(self.documents)} chunks)"
        )

    def search(
        self,
        query,
        k=3
    ):

        tokens = query.lower().split()

        scores = self.bm25.get_scores(
            tokens
        )

        ranked = sorted(

            zip(
                scores,
                self.documents
            ),

            reverse=True,

            key=lambda x: x[0]

        )

        results = []

        for score, document in ranked[:k]:

            results.append({

                "content":
                document.page_content,

                "source":
                document.metadata.get(
                    "source",
                    "Unknown"
                ),

                "score":
                float(score)

            })

        return results


bm25_retriever = BM25Retriever()