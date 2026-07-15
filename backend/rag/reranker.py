from services.groq_service import groq_service


class RAGReranker:

    def rerank(
        self,
        question,
        documents,
        top_k=3
    ):

        if not documents:

            return []

        prompt = f"""
You are an expert medical document ranker.

User Question:

{question}

Documents:

"""

        for i, doc in enumerate(documents):

            prompt += f"""

Document {i+1}

{doc["content"]}

"""

        prompt += """

Return ONLY the numbers of the most relevant documents.

Example:

2
5
1

No explanation.
"""

        response = groq_service.chat(

            system_prompt="Return only document numbers.",

            user_prompt=prompt

        )

        lines = response.strip().splitlines()

        chosen = []

        for line in lines:

            line = line.strip()

            if line.isdigit():

                idx = int(line) - 1

                if 0 <= idx < len(documents):

                    chosen.append(documents[idx])

        if not chosen:

            return documents[:top_k]
        
        print()

        print("========== RERANKER ==========")

        print("Selected Documents:")

        for doc in chosen[:top_k]:

            print(doc["source"])

        print("==============================")

        return chosen[:top_k]


reranker = RAGReranker()