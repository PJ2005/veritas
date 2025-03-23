import pytest
import numpy as np
from unittest.mock import MagicMock, patch
from app.services.verification_service import VerificationService


# Create mock Redis service
@pytest.fixture
def mock_redis_service():
    redis_service = MagicMock()
    redis_service.get_all_content_ids.return_value = ["id1", "id2", "id3"]
    redis_service.get_embedding.side_effect = lambda id: {
        "id1": [0.1, 0.2, 0.3, 0.4],
        "id2": [0.5, 0.6, 0.7, 0.8],
        "id3": [0.9, 0.8, 0.7, 0.6]
    }.get(id)
    redis_service.get_content_record.side_effect = lambda id: {
        "id1": {
            "timestamp": "2023-04-28T12:00:00",
            "metadata": {"title": "Test1", "author": "Author1"}
        },
        "id2": {
            "timestamp": "2023-04-28T13:00:00",
            "metadata": {"title": "Test2", "author": "Author2"}
        },
        "id3": {
            "timestamp": "2023-04-28T14:00:00",
            "metadata": {"title": "Test3", "author": "Author3"}
        }
    }.get(id)
    return redis_service


@patch('sentence_transformers.SentenceTransformer.encode')
def test_generate_embedding(mock_encode, mock_redis_service):
    """Test embedding generation"""
    # Setup mock
    mock_encode.return_value = np.array([0.1, 0.2, 0.3, 0.4])
    
    # Create service
    service = VerificationService(mock_redis_service)
    
    # Call method
    embedding = service.generate_embedding("Test content")
    
    # Verify
    assert mock_encode.called
    assert embedding == [0.1, 0.2, 0.3, 0.4]


def test_calculate_similarity(mock_redis_service):
    """Test similarity calculation"""
    # Create service
    service = VerificationService(mock_redis_service)
    
    # Test identical vectors
    vec1 = [0.1, 0.2, 0.3, 0.4]
    similarity = service.calculate_similarity(vec1, vec1)
    assert similarity > 0.999  # Should be very close to 1
    
    # Test completely different vectors
    vec2 = [-0.1, -0.2, -0.3, -0.4]
    similarity = service.calculate_similarity(vec1, vec2)
    assert similarity < 0.001  # Should be very close to 0
    
    # Test somewhat similar vectors
    vec3 = [0.15, 0.25, 0.25, 0.35]
    similarity = service.calculate_similarity(vec1, vec3)
    assert 0 < similarity < 1


@patch('app.services.verification_service.VerificationService.generate_embedding')
def test_find_similar_content(mock_generate, mock_redis_service):
    """Test finding similar content"""
    # Setup mock
    mock_generate.return_value = [0.9, 0.8, 0.7, 0.6]  # Same as id3
    
    # Create service
    service = VerificationService(mock_redis_service)
    
    # Better way to patch calculate_similarity
    original_calc = service.calculate_similarity
    
    def mock_similarity(e1, e2):
        # Map content IDs to similarity scores based on the embedding's identity
        # This approach is more robust than trying to manipulate the embedding values
        content_similarities = {
            "id1": 0.5,  # Below threshold
            "id2": 0.7,  # Below threshold
            "id3": 0.95  # Above threshold
        }
        # Find which content ID this embedding belongs to
        for content_id, embedding in {
            "id1": [0.1, 0.2, 0.3, 0.4],
            "id2": [0.5, 0.6, 0.7, 0.8],
            "id3": [0.9, 0.8, 0.7, 0.6]
        }.items():
            if embedding == e2:  # If this is the embedding we're checking
                return content_similarities[content_id]
        return 0.0  # Default similarity
    
    # Replace the method
    service.calculate_similarity = mock_similarity
    
    # Call method
    similar = service.find_similar_content("Test content", threshold=0.8)
    
    # Verify
    assert len(similar) == 1
    assert similar[0]["content_id"] == "id3"
    assert similar[0]["similarity_score"] == 0.95
    
    # Restore original method
    service.calculate_similarity = original_calc