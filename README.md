# Veritas - Decentralized IP Registry & Verification System

Veritas is a decentralized intellectual property registry and verification system that leverages Hedera Hashgraph for immutable record-keeping and AI-powered plagiarism detection to ensure content originality.

## Overview

This platform allows creators to:
- Timestamp and register their work on a distributed ledger
- Verify content originality through automated similarity analysis
- Establish proof of authorship with blockchain-backed evidence

## Problem Solved

Content creators struggle with:
- Establishing proof of authorship in digital environments
- Verifying content originality efficiently
- Traditional copyright registration (slow and expensive)
- Online plagiarism detection lacking legal standing

Veritas addresses these issues through blockchain-based timestamping and advanced AI similarity detection.

## Technology Stack

- **Distributed Ledger**: Hedera Hashgraph
- **Backend Framework**: FastAPI (v0.95.1)
- **AI/ML Components**: Sentence Transformers (v2.2.2)
- **Data Storage**: Redis (v6.2)
- **Containerization**: Docker

## Project Structure

- `/ip_registration` - Content fingerprinting and Hedera integration
- `/ai_verification` - Content similarity analysis and detection
- `/api` - FastAPI endpoints for client interaction
- `/utils` - Helper functions and utilities
- `/docker` - Containerization files

## Getting Started

### Prerequisites
- Python 3.9+
- Redis Server (v6.2+)
- Hedera Testnet Account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/veritas.git
cd veritas

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Start the application
uvicorn api.main:app --reload
```

## Documentation

API documentation is available after starting the server:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the LICENSE file for details.
