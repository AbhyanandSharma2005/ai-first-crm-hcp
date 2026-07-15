from rag.retriever import retriever
from rag.generator import rag_generator


class RAGPipeline:

    def ask(
        self,
        question
    ):

        results = retriever.search(
            question,
            k=3
        )

        if not results:

            return {

                "question": question,

                "context": [],

                "sources": [],

                "scores": [],

                "answer":
                    "I could not find that information in the documents."

            }

        context = [
            item["content"]
            for item in results
        ]

        sources = [
            item["source"]
            for item in results
        ]

        scores = [
            item["distance"]
            for item in results
        ]

        answer = rag_generator.generate(
            question,
            context
        )

        return {

            "question": question,

            "context": context,

            "sources": sources,

            "scores": scores,

            "answer": answer

        }


rag_pipeline = RAGPipeline()