from rag.vector_store import vector_store

vector_store.load()

print()

print("Chunks Loaded:")

print(len(vector_store.chunks))

print()

print(vector_store.chunks[0].page_content[:300])