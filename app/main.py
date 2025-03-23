import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .api.routes import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Define lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: nothing to do here
    yield
    # Shutdown: close Hedera client connection
    from .api.routes import hedera_service
    hedera_service.close()
    logging.info("Application shutting down")

# Create FastAPI application
app = FastAPI(
    title="Veritas IP Registry",
    description="Decentralized intellectual property registry using Hedera and AI",
    version="0.1.0",
    lifespan=lifespan
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[{"name": "content", "description": "Content operations"}]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Veritas IP Registry",
        "version": "0.1.0",
        "documentation": "/docs"
    }