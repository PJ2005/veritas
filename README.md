# Veritas - Decentralized IP Registry & Verification System

Veritas is a decentralized intellectual property registry and verification system that leverages Hedera Hashgraph for immutable record-keeping and AI-powered similarity detection to ensure content originality.

## Project Overview

Veritas provides a solution for content creators to establish proof of authorship and verify content originality through a combination of blockchain technology and AI-powered analysis. The system allows users to:

- Register and timestamp content on Hedera's distributed ledger
- Generate unique content fingerprints and embeddings
- Detect similarity with previously registered content
- Establish verifiable proof of authorship with legal standing

## Problem Solved

Content creators face significant challenges in the digital age:

- Proving original authorship of digital content
- Detecting plagiarism and unauthorized content reuse
- Establishing timestamps for intellectual property claims
- Navigating expensive and slow traditional copyright processes

Veritas addresses these challenges by providing an efficient, cost-effective solution that combines the immutability of blockchain with the intelligence of AI-powered similarity detection.

## Technical Architecture

The system is built on a modern tech stack:

- **Backend**: Python FastAPI application
- **Blockchain**: Hedera Hashgraph for immutable timestamping
- **AI/ML**: Sentence Transformers for semantic content analysis
- **Data Storage**: Redis for embedding and metadata storage
- **Deployment**: Docker containerized application

### System Components

1. **Content Registration Service**
   - Hashing of content for unique fingerprinting
   - Hedera integration for immutable timestamping
   - Metadata storage in Redis

2. **AI Verification Engine**
   - Generation of semantic embeddings for content
   - Similarity calculation between content pieces
   - Detection of potential plagiarism or derivative works

3. **API Layer**
   - Content registration endpoints
   - Verification endpoints
   - Health monitoring

## Project Structure

```
veritas/
├── app/                      # Application code
│   ├── api/                  # API routes and handlers
│   ├── models/               # Data models and schemas
│   ├── services/             # Core business logic services
│   │   ├── hedera_service.py # Blockchain integration
│   │   ├── redis_service.py  # Data storage service
│   │   └── verification_service.py # AI similarity detection
│   └── utils/                # Helper functions
├── tests/                    # Test suite
│   ├── test_api.py           # API endpoint tests
│   ├── test_utils.py         # Utility function tests
│   └── test_verification.py  # Verification service tests
├── docker/                   # Docker configuration
├── DockerFile                # Container definition
├── docker-compose.yml        # Multi-container setup
└── requirements.txt          # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose (for containerized deployment)
- Hedera Testnet Account
- Redis Server (or use the Docker Compose configuration)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/veritas.git
   cd veritas
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   # Copy the example .env file
   cp .env.example .env
   
   # Edit with your Hedera credentials and Redis configuration
   # Required: HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY
   ```

### Running the Application

#### Local Development

```bash
uvicorn app.main:app --reload
```

#### Docker Deployment

```bash
docker-compose up -d
```

## API Documentation

### Registration Endpoint

**POST /api/register**

Register content and obtain a blockchain-backed timestamp.

Request:
```json
{
  "content": "Your content here",
  "content_type": "text",
  "title": "Content Title",
  "author": "Author Name",
  "metadata": {}
}
```

Response:
```json
{
  "content_id": "hash_of_content",
  "timestamp": "2023-05-15T12:34:56",
  "transaction_id": "hedera_transaction_id",
  "content_hash": "hash_of_content"
}
```

### Verification Endpoint

**POST /api/verify**

Verify content originality against previously registered content.

Request:
```json
{
  "content": "Content to verify",
  "content_type": "text",
  "threshold": 0.85
}
```

Response:
```json
{
  "content_hash": "hash_of_submitted_content",
  "is_original": true,
  "similarity_threshold": 0.85,
  "matches": [
    {
      "content_id": "matching_content_id",
      "similarity_score": 0.92,
      "timestamp": "2023-05-10T15:30:00",
      "title": "Similar Content",
      "author": "Author Name"
    }
  ]
}
```

## Testing

The project includes a comprehensive test suite. To run tests:

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_verification.py

# Run with coverage report
pytest --cov=app
```

## Deployment

The application is containerized for easy deployment. The Docker Compose configuration includes:

- API service running the FastAPI application
- Redis instance for data storage

To deploy:

```bash
docker-compose up -d
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
