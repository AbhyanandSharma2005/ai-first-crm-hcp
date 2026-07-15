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

        context_text = "\n\n".join(context)

        system_prompt = """
You are an expert pharmaceutical CRM assistant.

Answer ONLY using the supplied context.

If the answer is not present in the context,
say:

'I could not find that information in the documents.'

Do not invent facts.
"""

        user_prompt = f"""
Context

{context_text}

----------------------------

Question

{question}

Answer:
"""

        return groq_service.chat(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )


rag_generator = RAGGenerator()