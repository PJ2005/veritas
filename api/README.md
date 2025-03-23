# API Layer

The API Layer exposes RESTful endpoints for client interaction with the Veritas system.

## Endpoints

### Content Registration

```
POST /api/v1/register
```

Register content on the Hedera ledger to establish proof of authorship.

**Request Body**:
```json
{
  "content": "Original content to register",
  "author_id": "user123",
  "content_type": "text"
}
```

**Response**:
```json
{
  "transaction_id": "0.0.123456@1618325073.789",
  "timestamp": "2023-04-13T12:31:13.789Z",
  "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "status": "success"
}
```

### Plagiarism Analysis

```
POST /api/v1/analyze
```

Analyze content for similarity against existing records.

**Request Body**:
```json
{
  "content": "Content to analyze for originality",
  "content_type": "text"
}
```

**Response**:
```json
{
  "analysis_id": "analysis_12345",
  "status": "processing"
}
```

### Analysis Results

```
GET /api/v1/analysis/{analysis_id}
```

Retrieve the results of a previously submitted analysis.

**Response**:
```json
{
  "analysis_id": "analysis_12345",
  "status": "completed",
  "originality_score": 0.92,
  "similar_content": [
    {
      "content_id": "content_789",
      "similarity_score": 0.23,
      "registration_date": "2023-03-15T09:12:45.123Z"
    }
  ],
  "completed_at": "2023-04-13T12:35:22.456Z"
}
```

## Implementation Details

- Built with FastAPI for high performance
- Asynchronous processing using background tasks
- Comprehensive error handling with appropriate HTTP status codes
- Auto-generated OpenAPI documentation

## Authentication

*Note: Authentication is not implemented in the demo version.*

Future versions will include:
- OAuth2 authentication flow
- API key validation
- Rate limiting
