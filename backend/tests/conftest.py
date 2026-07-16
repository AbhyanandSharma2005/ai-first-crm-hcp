from fastapi.testclient import TestClient

from app import app

# Initialize RAG before creating TestClient
from rag.startup import initialize_rag

initialize_rag()

client = TestClient(app)