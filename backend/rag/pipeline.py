from rag.retriever import retriever
from rag.generator import rag_generator


class RAGPipeline:

    def ask(
        self,
        question
    ):

        context = retriever.search(
            question,
            k=3
        )

        answer = rag_generator.generate(
            question,
            context
        )

        sources = []

        for item in context:

            sources.append(

                {

                    "source": item["source"],

                    "page": item["page"]

                }

            )

        return {

            "question": question,

            "context": context,

            "answer": answer,

            "sources": sources

        }


rag_pipeline = RAGPipeline()