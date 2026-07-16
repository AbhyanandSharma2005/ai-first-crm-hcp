from rank_bm25 import BM25Okapi

from rag.loader import document_loader
from rag.splitter import document_splitter


class BM25Retriever:

    def __init__(self):

        self.documents = []

        self.tokenized = []

        self.bm25 = None

    def build(self):

        print("\n================================")
        print("BM25 BUILD STARTED")
        print("Object ID :", id(self))
        print("================================")

        documents = document_loader.load_documents(
            "rag/documents"
        )

        print(f"Loaded Documents : {len(documents)}")

        self.documents = (
            document_splitter.split_documents(
                documents
            )
        )

        print(f"Document Chunks : {len(self.documents)}")

        self.tokenized = [

            doc.page_content.lower().split()

            for doc in self.documents

        ]

        print(f"Tokenized Chunks : {len(self.tokenized)}")

        if len(self.tokenized) == 0:

            print("ERROR: No documents available to build BM25.")
            return

        self.bm25 = BM25Okapi(
            self.tokenized
        )

        print("================================")
        print("BM25 BUILD SUCCESS")
        print("Object ID :", id(self))
        print("BM25 Obj  :", self.bm25)
        print(f"Chunks    : {len(self.documents)}")
        print("================================")

    def search(
        self,
        query,
        k=3
    ):

        print("\n================================")
        print("BM25 SEARCH")
        print("Object ID :", id(self))
        print("BM25 Obj  :", self.bm25)
        print("Query     :", query)
        print("================================")

        if self.bm25 is None:

            print("ERROR: BM25 index has NOT been initialized!")

            raise RuntimeError(
                "BM25Retriever.build() was never called or failed."
            )

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

        print(f"Returned {len(results)} BM25 results.")

        return results


bm25_retriever = BM25Retriever()