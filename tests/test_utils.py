import pytest
import json
from app.utils.helpers import generate_content_hash, get_current_timestamp, serialize_for_hedera
from datetime import datetime, timezone


def test_generate_content_hash():
    """Test content hash generation"""
    content = "Test content"
    hash1 = generate_content_hash(content)
    hash2 = generate_content_hash(content)
    
    # Same content should produce same hash
    assert hash1 == hash2
    
    # Different content should produce different hash
    different_hash = generate_content_hash("Different content")
    assert hash1 != different_hash
    
    # Hash should be valid SHA-256 (64 hex characters)
    assert len(hash1) == 64
    

def test_get_current_timestamp():
    """Test timestamp generation"""
    timestamp = get_current_timestamp()
    
    # Should return datetime object
    assert isinstance(timestamp, datetime)
    
    # Should be close to current time
    now = datetime.utcnow()
    diff = now - timestamp
    assert abs(diff.total_seconds()) < 1  # Within 1 second


def test_serialize_for_hedera():
    """Test Hedera data serialization"""
    content_hash = "1234567890abcdef"
    metadata = {"title": "Test", "author": "Tester"}
    
    serialized = serialize_for_hedera(content_hash, metadata)
    
    # Should be valid JSON
    data = json.loads(serialized)
    
    # Should contain expected fields
    assert data["content_hash"] == content_hash
    assert data["metadata"] == metadata
    assert "timestamp" in data