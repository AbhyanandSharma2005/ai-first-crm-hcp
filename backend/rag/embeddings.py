import os

import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings


_model = None


def get_embedding_model():
    """
    Load the Google Generative AI embedding model only once.
    Uses the GOOGLE_API_KEY environment variable.
    Model: text-embedding-004 (768-dimensional output).
    No local PyTorch/DLLs required — pure API calls.
    """

    global _model

    if _model is None:

        api_key = os.environ.get("GOOGLE_API_KEY")

        if not api_key:
            raise EnvironmentError(
                "GOOGLE_API_KEY is not set. "
                "Add it to your .env file to use Google embeddings."
            )

        _model = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=api_key
        )

    return _model


def generate_embeddings(chunks):
    """
    Generate embeddings for a list of LangChain Documents.
    Returns a numpy array of shape (n_chunks, 768).
    """

    model = get_embedding_model()

    texts = [
        doc.page_content
        for doc in chunks
    ]

    vectors = model.embed_documents(texts)

    return np.array(vectors, dtype=np.float32)


def embed_query(query):
    """
    Generate embedding for a single query string.
    Returns a numpy array of shape (768,).
    """

    model = get_embedding_model()

    vector = model.embed_query(query)

    return np.array(vector, dtype=np.float32)