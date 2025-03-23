import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

client = TestClient(app)


@patch('app.api.routes.hedera_service')
@patch('app.api.routes.verification_service')
def test_register_content(mock_verification, mock_hedera):
    """Test content registration endpoint"""
    # Setup mocks
    mock_hedera.register_content.return_value = ("transaction123", "2023-04-28T12:00:00Z")
    mock_verification.generate_embedding.return_value = [0.1, 0.2, 0.3, 0.4]
    
    # Test request
    response = client.post(
        "/api/register",
        json={
            "content": "Test content",
            "content_type": "text",
            "title": "Test Title",
            "author": "Test Author"
        }
    )
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert "content_id" in data
    assert "transaction_id" in data
    assert data["transaction_id"] == "transaction123"


@patch('app.api.routes.verification_service')
def test_verify_content(mock_verification):
    """Test content verification endpoint"""
    # Setup mock to return some similar content
    mock_verification.find_similar_content.return_value = [
        {
            "content_id": "id1",
            "similarity_score": 0.9,
            "timestamp": "2023-04-28T12:00:00",
            "title": "Similar Title",
            "author": "Similar Author"
        }
    ]
    
    # Test request
    response = client.post(
        "/api/verify",
        json={
            "content": "Test content to verify",
            "content_type": "text",
            "threshold": 0.8
        }
    )
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert "content_hash" in data
    assert "is_original" in data
    assert data["is_original"] is False  # Because we mocked a similar item
    assert len(data["matches"]) == 1
    assert data["matches"][0]["similarity_score"] == 0.9


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"