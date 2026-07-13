from sentence_transformers import SentenceTransformer


_model = None


def get_embedding_model():
    """
    Load the embedding model only once.
    """

    global _model

    if _model is None:

        _model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return _model


def generate_embeddings(chunks):
    """
    Generate embeddings for LangChain Documents.
    """

    model = get_embedding_model()

    texts = [
        doc.page_content
        for doc in chunks
    ]

    return model.encode(
        texts,
        convert_to_numpy=True
    )


def embed_query(query):
    """
    Generate embedding for a single query.
    """

    model = get_embedding_model()

    return model.encode(
        query,
        convert_to_numpy=True
    )