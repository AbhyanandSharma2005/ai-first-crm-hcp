from rag.pipeline import rag_pipeline


def rag_tool(state: dict):

    question = state["user_message"]

    result = rag_pipeline.ask(question)

    return {

        "tool_result": {

            "status": "success",

            "question": result["question"],

            "context": result["context"],

            "sources": result["sources"],

            "scores": result["scores"],

            "answer": result["answer"]

        }

    }