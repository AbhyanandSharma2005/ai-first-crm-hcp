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


# ==========================================================
# Swagger Tag Metadata
# ==========================================================

tags_metadata = [

    {
        "name": "AI Chat",
        "description": "AI-powered CRM assistant with LangGraph, RAG and Document Question Answering."
    },

    {
        "name": "Interaction",
        "description": "Create and retrieve Healthcare Professional interactions."
    },

    {
        "name": "Edit Interaction",
        "description": "Update existing interactions."
    },

    {
        "name": "HCP",
        "description": "Search Healthcare Professionals."
    },

    {
        "name": "System",
        "description": "Health, version and API information."
    }

]


# ==========================================================
# FastAPI Application
# ==========================================================

app = FastAPI(

    title="AI First CRM HCP API",

    version="1.0.0",

    description="""
AI-powered CRM backend for Healthcare Professionals.

## Features

- Log Interaction
- Edit Interaction
- Search HCP
- Next Best Action
- Follow-up Scheduler
- Conversation Memory
- Retrieval-Augmented Generation (RAG)
- Document Question Answering

## AI Stack

- FastAPI
- LangGraph
- Groq
- PostgreSQL
- FAISS
""",

    openapi_tags=tags_metadata,

    contact={
        "name": "AI First CRM Team",
        "email": "support@example.com"
    },

    license_info={
        "name": "MIT"
    },

    servers=[
        {
            "url": "http://127.0.0.1:8000",
            "description": "Local Development Server"
        }
    ]

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

@app.get(

    "/",

    summary="API Information",

    description="Returns API status and documentation link.",

    tags=["System"]

)
def home():

    return {

        "success": True,

        "message": "AI First CRM Backend Running",

        "data": {

            "version": "1.0.0",

            "status": "Healthy",

            "documentation": "/docs"

        },

        "error": None

    }


# ==========================================================
# Health Check
# ==========================================================

@app.get(

    "/health",

    summary="Health Check",

    description="Returns the health status of the backend.",

    tags=["System"]

)
def health():

    return {

        "success": True,

        "message": "Server is healthy.",

        "data": {

            "status": "UP"

        },

        "error": None

    }


# ==========================================================
# Version
# ==========================================================

@app.get(

    "/version",

    summary="API Version",

    description="Returns the current API version.",

    tags=["System"]

)
def version():

    return {

        "success": True,

        "message": "Version fetched successfully.",

        "data": {

            "version": "1.0.0"

        },

        "error": None

    }