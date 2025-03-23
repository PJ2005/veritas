from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from ..models.schemas import (
    RegistrationRequest, RegistrationResponse, 
    VerificationRequest, VerificationResponse, SimilarityMatch
)
from ..services.hedera_service import HederaService
from ..services.redis_service import RedisService
from ..services.verification_service import VerificationService
from ..utils.helpers import generate_content_hash, serialize_for_hedera, get_current_timestamp
from typing import Dict, List
from datetime import datetime

router = APIRouter()

# Services initialization
redis_service = RedisService()
hedera_service = HederaService()
verification_service = VerificationService(redis_service)


def process_content_registration(content_hash: str, transaction_id: str, 
                               timestamp: datetime, request: RegistrationRequest):
    """Background task to process content registration"""
    try:
        # Generate embedding
        embedding = verification_service.generate_embedding(request.content)
        
        # Store embedding
        redis_service.store_embedding(content_hash, embedding)
        
        # Store content record
        metadata = {
            "title": request.title,
            "author": request.author,
            "content_type": request.content_type,
            **request.metadata
        }
        
        content_record = {
            "transaction_id": transaction_id,
            "timestamp": timestamp.isoformat(),
            "metadata": metadata
        }
        
        redis_service.store_content_record(content_hash, content_record)
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error in background processing: {str(e)}")


@router.post("/register", response_model=RegistrationResponse)
async def register_content(request: RegistrationRequest, background_tasks: BackgroundTasks):
    """Register content on Hedera and store metadata"""
    try:
        # Generate content hash
        content_hash = generate_content_hash(request.content)
        
        # Prepare data for Hedera
        metadata = {
            "title": request.title,
            "author": request.author,
            "content_type": request.content_type
        }
        hedera_data = serialize_for_hedera(content_hash, metadata)
        
        # Submit to Hedera
        transaction_id, consensus_timestamp = hedera_service.register_content(hedera_data)
        
        # Parse timestamp
        timestamp = datetime.fromisoformat(consensus_timestamp.replace('Z', '+00:00'))
        
        # Schedule background processing
        background_tasks.add_task(
            process_content_registration,
            content_hash,
            transaction_id,
            timestamp,
            request
        )
        
        return RegistrationResponse(
            content_id=content_hash,
            timestamp=timestamp,
            transaction_id=transaction_id,
            content_hash=content_hash
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/verify", response_model=VerificationResponse)
async def verify_content(request: VerificationRequest):
    """Verify content originality against registered content"""
    try:
        # Generate content hash
        content_hash = generate_content_hash(request.content)
        
        # Find similar content
        similar_content = verification_service.find_similar_content(
            request.content, 
            threshold=request.threshold
        )
        
        # Convert to response model
        matches = []
        for item in similar_content:
            matches.append(SimilarityMatch(
                content_id=item["content_id"],
                similarity_score=item["similarity_score"],
                timestamp=datetime.fromisoformat(item["timestamp"]),
                title=item.get("title"),
                author=item.get("author")
            ))
        
        # Determine if content is original
        is_original = len(matches) == 0
        
        return VerificationResponse(
            content_hash=content_hash,
            is_original=is_original,
            similarity_threshold=request.threshold,
            matches=matches
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")


@router.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "ok", "timestamp": get_current_timestamp()}