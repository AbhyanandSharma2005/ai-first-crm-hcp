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

        return {
            "question": question,
            "context": context,
            "answer": answer
        }


rag_pipeline = RAGPipeline()