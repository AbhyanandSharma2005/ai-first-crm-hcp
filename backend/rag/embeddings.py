import os
import numpy as np

from google import genai

_client = None


def get_client():
    """
    Returns a singleton Google GenAI client.
    """

    global _client

    if _client is None:

        api_key = os.getenv("GOOGLE_API_KEY")

        if not api_key:
            raise EnvironmentError(
                "GOOGLE_API_KEY is missing."
            )

        _client = genai.Client(api_key=api_key)

    return _client


def generate_embeddings(chunks):
    """
    Generate embeddings for LangChain Documents.
    Returns numpy array (N x D)
    """

    client = get_client()

    vectors = []

    for doc in chunks:

        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=doc.page_content
        )

        vectors.append(
            response.embeddings[0].values
        )

    return np.array(vectors, dtype=np.float32)


def embed_query(query):
    """
    Generate embedding for one query.
    """

    client = get_client()

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=query
    )

    return np.array(
        response.embeddings[0].values,
        dtype=np.float32
    )