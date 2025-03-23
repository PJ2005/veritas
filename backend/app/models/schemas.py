from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    CODE = "code"
    DOCUMENT = "document"


class RegistrationRequest(BaseModel):
    content: str = Field(..., description="Content to register")
    content_type: ContentType = Field(default=ContentType.TEXT, description="Type of content")
    title: Optional[str] = Field(None, description="Title of the content")
    author: Optional[str] = Field(None, description="Author name")
    metadata: Optional[Dict] = Field(default={}, description="Additional metadata")


class RegistrationResponse(BaseModel):
    content_id: str = Field(..., description="Unique identifier for the content")
    timestamp: datetime = Field(..., description="Registration timestamp")
    transaction_id: str = Field(..., description="Hedera transaction ID")
    content_hash: str = Field(..., description="SHA-256 hash of the content")


class VerificationRequest(BaseModel):
    content: str = Field(..., description="Content to verify")
    content_type: ContentType = Field(default=ContentType.TEXT, description="Type of content")
    threshold: float = Field(default=0.85, description="Similarity threshold (0-1)")


class SimilarityMatch(BaseModel):
    content_id: str = Field(..., description="ID of the similar content")
    similarity_score: float = Field(..., description="Similarity score (0-1)")
    timestamp: datetime = Field(..., description="Original registration timestamp")
    title: Optional[str] = Field(None, description="Title of the matched content")
    author: Optional[str] = Field(None, description="Author of the matched content")


class VerificationResponse(BaseModel):
    content_hash: str = Field(..., description="SHA-256 hash of the submitted content")
    is_original: bool = Field(..., description="Whether the content is considered original")
    similarity_threshold: float = Field(..., description="Threshold used for determination")
    matches: List[SimilarityMatch] = Field(default=[], description="Similar content matches")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall status of the API")
    timestamp: datetime = Field(..., description="Current server timestamp")
    version: str = Field(..., description="API version")
    services: Dict[str, str] = Field(..., description="Status of dependent services")
    system: Dict[str, Any] = Field(..., description="System metrics")