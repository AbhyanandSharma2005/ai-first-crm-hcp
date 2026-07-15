from rag.pipeline import rag_pipeline


def rag_tool(state: dict):
    """
    Executes the RAG pipeline and returns the result
    in a format compatible with the LangGraph agent.
    """

    question = state["user_message"]

    result = rag_pipeline.ask(question)

    return {

        "tool_result": {

            "status": "success",

            "question": result.get(
                "question",
                question
            ),

            "rewritten_query": result.get(
                "rewritten_query",
                question
            ),

            "context": result.get(
                "context",
                []
            ),

            "sources": result.get(
                "sources",
                []
            ),

            "scores": result.get(
                "scores",
                []
            ),

            "answer": result.get(
                "answer",
                "Unable to answer from documents."
            )

        }

    }