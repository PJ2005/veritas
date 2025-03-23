import os
import json
import redis
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class RedisService:
    def __init__(self):
        redis_host = os.environ.get("REDIS_HOST", "localhost")
        redis_port = int(os.environ.get("REDIS_PORT", 6379))
        redis_db = int(os.environ.get("REDIS_DB", 0))
        
        self.client = redis.Redis(
            host=redis_host,
            port=redis_port,
            db=redis_db,
            decode_responses=True
        )
        logger.info(f"Connected to Redis at {redis_host}:{redis_port}/{redis_db}")
        
        # Key prefixes for different data types
        self.content_prefix = "content:"
        self.embedding_prefix = "embedding:"
        
    def store_content_record(self, content_id: str, record: Dict[str, Any]) -> bool:
        """Store content record in Redis"""
        try:
            key = f"{self.content_prefix}{content_id}"
            self.client.set(key, json.dumps(record))
            logger.info(f"Stored content record for ID: {content_id}")
            return True
        except Exception as e:
            logger.error(f"Error storing content record: {str(e)}")
            return False
    
    def get_content_record(self, content_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve content record from Redis"""
        try:
            key = f"{self.content_prefix}{content_id}"
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Error retrieving content record: {str(e)}")
            return None
    
    def store_embedding(self, content_id: str, embedding: List[float]) -> bool:
        """Store content embedding in Redis"""
        try:
            key = f"{self.embedding_prefix}{content_id}"
            self.client.set(key, json.dumps(embedding))
            # Add to content IDs set for similarity search
            self.client.sadd("content_ids", content_id)
            logger.info(f"Stored embedding for content ID: {content_id}")
            return True
        except Exception as e:
            logger.error(f"Error storing embedding: {str(e)}")
            return False
    
    def get_embedding(self, content_id: str) -> Optional[List[float]]:
        """Retrieve content embedding from Redis"""
        try:
            key = f"{self.embedding_prefix}{content_id}"
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Error retrieving embedding: {str(e)}")
            return None
    
    def get_all_content_ids(self) -> List[str]:
        """Get all content IDs for similarity search"""
        try:
            return list(self.client.smembers("content_ids"))
        except Exception as e:
            logger.error(f"Error retrieving content IDs: {str(e)}")
            return []