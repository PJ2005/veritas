# AI Verification Engine

The AI Verification Engine handles content similarity analysis and plagiarism detection in the Veritas system.

## Features

- Text embedding generation
- Vector similarity search
- Plagiarism scoring and detection
- Semantic analysis of content

## How It Works

1. Content is submitted for analysis
2. The system generates text embeddings using Sentence Transformers
3. These embeddings are compared against the database
4. Similarity scores are calculated using cosine distance
5. Analysis results are returned with confidence ratings

## Technical Details

- **Model**: all-mpnet-base-v2 for text embeddings
- **Similarity Metric**: Cosine distance
- **Processing**: Asynchronous background tasks for computation
- **Caching**: Redis for storing embeddings and results

## Usage

```python
from ai_verification.engine import VerificationEngine

# Initialize the engine
verification_engine = VerificationEngine(
    model_name="all-mpnet-base-v2",
    redis_client=redis_client
)

# Analyze content for originality
analysis_id = await verification_engine.submit_analysis(
    content="Content to analyze for originality",
    content_type="text"
)

# Retrieve analysis results
results = await verification_engine.get_analysis_results(analysis_id)
```

## Performance Considerations

- Text embedding generation is computationally intensive
- Background tasks handle heavy processing
- Redis caching improves response times for repeated checks

## Dependencies

- `sentence_transformers`: For generating text embeddings
- `numpy`: For vector operations
- `redis`: For caching embeddings and results
