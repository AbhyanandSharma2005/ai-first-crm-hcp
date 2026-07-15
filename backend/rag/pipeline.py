from rag.retriever import retriever
from rag.generator import rag_generator
from rag.query_rewriter import query_rewriter


class RAGPipeline:

    def ask(
        self,
        question
    ):

        # ---------------------------------------------
        # Rewrite the user query
        # ---------------------------------------------
        try:

            rewritten_query = query_rewriter.rewrite(
                question
            )

            if (
                rewritten_query is None
                or not rewritten_query.strip()
            ):

                rewritten_query = question

        except Exception:

            rewritten_query = question

        # ---------------------------------------------
        # Retrieve documents
        # ---------------------------------------------
        results = retriever.search(
            rewritten_query,
            k=3
        )

        # ---------------------------------------------
        # No documents found
        # ---------------------------------------------
        if not results:

            return {

                "question": question,

                "rewritten_query": rewritten_query,

                "context": [],

                "sources": [],

                "scores": [],

                "answer":
                    "I could not find that information in the documents."

            }

        # ---------------------------------------------
        # Extract context
        # ---------------------------------------------
        context = [

            item["content"]

            for item in results

        ]

        sources = [

            item["source"]

            for item in results

        ]

        scores = []

        for item in results:

            if "distance" in item:

                scores.append(
                    item["distance"]
                )

            elif "score" in item:

                scores.append(
                    item["score"]
                )

            else:

                scores.append(None)

        # ---------------------------------------------
        # Generate final answer
        # ---------------------------------------------
        answer = rag_generator.generate(
            question,
            context
        )

        # ---------------------------------------------
        # Return complete result
        # ---------------------------------------------
        return {

            "question": question,

            "rewritten_query": rewritten_query,

            "context": context,

            "sources": sources,

            "scores": scores,

            "answer": answer

        }


rag_pipeline = RAGPipeline()