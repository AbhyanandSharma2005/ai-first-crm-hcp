from services.groq_service import groq_service


class QueryRewriter:

    def rewrite(
        self,
        query: str
    ) -> str:

        system_prompt = """
You improve search queries.

Rewrite the user's question so it becomes
more descriptive for document retrieval.

Do NOT answer the question.

Return ONLY the rewritten query.
"""

        user_prompt = f"""
Original Question:

{query}

Rewritten Search Query:
"""

        try:

            rewritten = groq_service.chat(

                system_prompt=system_prompt,

                user_prompt=user_prompt

            )

            rewritten = rewritten.strip()

            if rewritten:

                return rewritten

        except Exception:

            pass

        return query


query_rewriter = QueryRewriter()