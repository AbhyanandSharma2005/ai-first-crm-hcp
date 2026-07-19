from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi import WebSocket, WebSocketDisconnect

from routes import interaction
from routes import chat
from routes import edit
from routes import hcp
from routes import dashboard

from rag.startup import initialize_rag

from utils.exception_handler import (
    generic_exception_handler,
    validation_exception_handler
)

from utils.logger import logger
from middleware.logging import LoggingMiddleware

from sqlalchemy.orm import Session

from database import get_db

from models import Interaction, HCP

from fastapi import Depends

from websocket_manager import manager

import asyncio
import json
from datetime import datetime


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

    logger.info("Initializing RAG...")

    initialize_rag()

    logger.info("Application started successfully.")


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

# Request Logging Middleware
app.add_middleware(
    LoggingMiddleware
)


# ==========================================================
# Routers
# ==========================================================

app.include_router(interaction.router)

app.include_router(chat.router)

app.include_router(edit.router)

app.include_router(hcp.router)

app.include_router(dashboard.router)

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

            "service": "AI First CRM HCP API",

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

    description="Returns the current health status of the backend.",

    tags=["System"]

)
def health():

    logger.info("Health endpoint accessed.")

    return {

        "success": True,

        "message": "Application is healthy.",

        "data": {

            "status": "UP"

        },

        "error": None

    }


# ==========================================================
# Version Information
# ==========================================================

@app.get(

    "/version",

    summary="Application Version",

    description="Returns application version and runtime information.",

    tags=["System"]

)
def version():

    logger.info("Version endpoint accessed.")

    return {

        "success": True,

        "message": "Version information.",

        "data": {

            "version": "1.0.0",

            "framework": "FastAPI",

            "python": "3.13"

        },

        "error": None

    }


# ==========================================================
# Metrics
# ==========================================================

@app.get(

    "/metrics",

    summary="Application Metrics",

    description="Returns application runtime metrics.",

    tags=["System"]

)
def metrics(

    db: Session = Depends(get_db)

):

    logger.info("Metrics endpoint accessed.")

    try:

        total_interactions = (

            db.query(Interaction)

            .count()

        )

        total_hcps = (

            db.query(HCP)

            .count()

        )

        return {

            "success": True,

            "message": "Application metrics.",

            "data": {

                "total_interactions": total_interactions,

                "total_hcps": total_hcps,

                "status": "Running",

                "environment": "Development",

                "api": "AI First CRM HCP API",

                "version": "1.0.0"

            },

            "error": None

        }

    except Exception as e:

        logger.exception(

            "Failed to load metrics."

        )

        return {

            "success": False,

            "message": "Unable to load metrics.",

            "data": None,

            "error": str(e)

        }


# ==========================================================
# WebSocket Endpoint
# ==========================================================

@app.websocket("/ws/dashboard")
async def dashboard_socket(

    websocket: WebSocket

):

    """
    WebSocket endpoint for real-time dashboard updates.
    
    Clients can connect to this endpoint to receive live updates
    about dashboard statistics, KPIs, and other real-time data.
    
    The connection remains open until the client disconnects.
    """
    
    logger.info("New WebSocket connection attempt for dashboard.")

    await manager.connect(websocket)

    try:

        # Send initial connection success message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "message": "Connected to dashboard WebSocket"
        })

        logger.info("WebSocket connection established successfully.")

        # Keep connection alive with timeout mechanism
        while True:
            try:
                # Wait for message with 30 second timeout
                data = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=30
                )

                logger.debug(f"WebSocket message received: {data}")
                
                # Handle different message types
                try:
                    message = json.loads(data)
                    
                    if message.get("type") == "ping":
                        # Respond to ping with pong
                        await websocket.send_json({
                            "type": "pong",
                            "timestamp": datetime.now().isoformat()
                        })
                        logger.debug("Pong sent to client")
                        
                    elif message.get("type") == "pong":
                        # Client responded to our ping
                        logger.debug("Pong received from client")
                        
                    elif message.get("type") == "client_connected":
                        # Client handshake
                        logger.info(f"Client connected: {message.get('client', 'unknown')}")
                        
                    else:
                        logger.info(f"Unknown message type: {message.get('type', 'unknown')}")
                        
                except json.JSONDecodeError:
                    logger.warning("Invalid JSON received from client")
                    # Send error response
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid JSON format"
                    })

            except asyncio.TimeoutError:
                # Send ping to client to keep connection alive
                try:
                    await websocket.send_json({
                        "type": "ping",
                        "timestamp": datetime.now().isoformat()
                    })
                    logger.debug("Ping sent to client")
                except Exception as e:
                    logger.error(f"Failed to send ping: {e}")
                    break

    except WebSocketDisconnect:

        logger.info("WebSocket client disconnected.")

        manager.disconnect(websocket)

    except Exception as e:

        logger.exception(f"WebSocket error: {e}")

        try:

            await websocket.close()

        except:

            pass

        manager.disconnect(websocket)