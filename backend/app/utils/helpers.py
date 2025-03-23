import hashlib
import json
from datetime import datetime
from typing import Dict, Any


def generate_content_hash(content: str) -> str:
    """Generate SHA-256 hash of content"""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def get_current_timestamp() -> datetime:
    """Get current UTC timestamp"""
    return datetime.now()


def format_transaction_record(transaction_id: str, content_hash: str, 
                              timestamp: datetime, metadata: Dict = None) -> Dict[str, Any]:
    """Format transaction record for storage"""
    return {
        "transaction_id": transaction_id,
        "content_hash": content_hash,
        "timestamp": timestamp.isoformat(),
        "metadata": metadata or {}
    }


def serialize_for_hedera(content_hash: str, metadata: Dict = None) -> str:
    """Serialize data for Hedera Consensus submission"""
    data = {
        "content_hash": content_hash,
        "timestamp": get_current_timestamp().isoformat(),
        "metadata": metadata or {}
    }
    return json.dumps(data)