from rag.vector_store import vector_store


vector_store.build()

vector_store.save()

print()

print("Reloading...")

vector_store.load()