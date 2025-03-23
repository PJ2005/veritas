import logging
import numpy as np
from typing import List, Dict, Any, Tuple
from sentence_transformers import SentenceTransformer
from .redis_service import RedisService

logger = logging.getLogger(__name__)

class VerificationService:
    def __init__(self, redis_service: RedisService):
        self.model = SentenceTransformer('all-mpnet-base-v2')
        self.redis_service = redis_service
        logger.info("Initialized verification service with SentenceTransformer model")
    
    def generate_embedding(self, content: str) -> List[float]:
        """Generate text embedding for content"""
        try:
            embedding = self.model.encode(content)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise Exception(f"Failed to generate embedding: {str(e)}")
    
    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        try:
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Normalize vectors
            vec1 = vec1 / np.linalg.norm(vec1)
            vec2 = vec2 / np.linalg.norm(vec2)
            
            # Calculate cosine similarity
            similarity = np.dot(vec1, vec2)
            return float(similarity)
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            return 0.0
    
    def find_similar_content(self, content: str, threshold: float = 0.85) -> List[Dict[str, Any]]:
        """Find similar content above threshold"""
        try:
            # Generate embedding for input content
            query_embedding = self.generate_embedding(content)
            
            # Get all content IDs
            content_ids = self.redis_service.get_all_content_ids()
            
            similar_items = []
            
            # Compare with all stored embeddings
            for content_id in content_ids:
                stored_embedding = self.redis_service.get_embedding(content_id)
                if not stored_embedding:
                    continue
                
                similarity = self.calculate_similarity(query_embedding, stored_embedding)
                
                if similarity >= threshold:
                    # Get content record
                    content_record = self.redis_service.get_content_record(content_id)
                    if content_record:
                        similar_items.append({
                            "content_id": content_id,
                            "similarity_score": similarity,
                            "timestamp": content_record.get("timestamp"),
                            "title": content_record.get("metadata", {}).get("title"),
                            "author": content_record.get("metadata", {}).get("author")
                        })
            
            # Sort by similarity score (descending)
            similar_items.sort(key=lambda x: x["similarity_score"], reverse=True)
            
            return similar_items
        except Exception as e:
            logger.error(f"Error finding similar content: {str(e)}")
            return []