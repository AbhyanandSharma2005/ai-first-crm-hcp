from services.groq_service import groq_service


class RAGGenerator:

    def generate(
        self,
        question,
        context
    ):

        # -----------------------------------------
        # No relevant context found
        # -----------------------------------------

        if not context:

            return (
                "I could not find that information."
                "in the documents."
            )

        # -----------------------------------------
        # Combine retrieved chunks
        # -----------------------------------------

        context_text = "\n\n".join(context)

        # -----------------------------------------
        # Strong hallucination guard
        # -----------------------------------------

        system_prompt = """
You are an expert Pharmaceutical CRM assistant.

IMPORTANT RULES:

1. Answer ONLY from the supplied document context.

2. NEVER use outside knowledge.

3. NEVER guess.

4. NEVER invent numbers, studies,
   dosages, products or conclusions.

5. If the answer is not completely supported
   by the context, respond exactly:

"I could not find that information in the documents."

6. Keep the answer concise and factual.

7. If multiple document chunks mention
   the answer, combine them naturally.

8. Do not mention that you are an AI.
"""

        user_prompt = f"""
DOCUMENT CONTEXT

{context_text}

----------------------------------------

QUESTION

{question}

----------------------------------------

ANSWER ONLY USING THE DOCUMENTS.
"""

        response = groq_service.chat(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )

        return response.strip()


rag_generator = RAGGenerator()