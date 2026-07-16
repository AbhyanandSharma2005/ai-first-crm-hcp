from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from routes import interaction
from routes import chat
from routes import edit
from routes import hcp

from rag.startup import initialize_rag

from utils.exception_handler import (
    generic_exception_handler,
    validation_exception_handler
)


app = FastAPI(

    title="AI First CRM HCP API",

    version="1.0.0",

    description="""
AI-powered CRM backend for Healthcare Professionals.

Features

- Log Interaction
- Edit Interaction
- Search HCP
- Next Best Action
- Follow-up Scheduler
- Conversation Memory
- Retrieval-Augmented Generation (RAG)
- Document Question Answering
"""
)


# ==========================================================
# Exception Handlers
# ==========================================================

app.add_exception_handler(

    RequestValidationError,

    validation_exception_handler

)

app.add_exception_handler(

    Exception,

    generic_exception_handler

)


# ==========================================================
# Startup
# ==========================================================

@app.on_event("startup")
def startup():

    initialize_rag()


# ==========================================================
# Middleware
# ==========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# ==========================================================
# Routers
# ==========================================================

app.include_router(interaction.router)

app.include_router(chat.router)

app.include_router(edit.router)

app.include_router(hcp.router)


# ==========================================================
# Root Endpoint
# ==========================================================

@app.get("/")
def home():

    return {

        "success": True,

        "message": "AI CRM Backend Running",

        "data": {

            "service": "AI First CRM HCP API",

            "version": "1.0.0"

        },

        "error": None

    }