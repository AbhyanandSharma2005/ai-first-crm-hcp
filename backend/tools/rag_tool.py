from rag.pipeline import rag_pipeline


def rag_tool(state: dict) -> dict:
    """
    Execute the RAG pipeline for document-based questions.
    """

    question = state["user_message"]

    result = rag_pipeline.ask(question)

    return {

        "tool_result": {

            "status": "success",

            "question": result["question"],

            "context": result["context"],

            "answer": result["answer"],
            
            "sources": result["sources"]

        }

    }