from services.groq_service import groq_service


class RAGGenerator:

    def generate(
        self,
        question,
        context
    ):

        if not context:

            return (

                "I couldn't find any relevant information "

                "in the knowledge base."

            )

        context_text = ""

        for item in context:

            context_text += (

                f"Document: {item['source']}\n"

                f"Page: {item['page']}\n\n"

                f"{item['content']}\n\n"

                "---------------------------------\n\n"

            )

        system_prompt = """
You are an expert pharmaceutical CRM assistant.

Answer ONLY using the supplied context.

Never use outside knowledge.

If the answer is not present in the supplied context,
reply exactly:

'I could not find that information in the documents.'

Always answer professionally.

Never invent facts.
"""

        user_prompt = f"""
Context

{context_text}

-----------------------------------------

Question

{question}

Answer:
"""

        return groq_service.chat(

            system_prompt=system_prompt,

            user_prompt=user_prompt

        )


rag_generator = RAGGenerator()