from rag.embeddings import embed_query

vector = embed_query(
    "What are the benefits of CardioX?"
)

print()

print(vector.shape)

print()

print(vector[:10])