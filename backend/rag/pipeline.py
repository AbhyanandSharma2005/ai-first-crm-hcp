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

        context = [
            item["content"]
            for item in results
        ]

        sources = [
            item["source"]
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

            "answer": answer

        }


rag_pipeline = RAGPipeline()