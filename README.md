# Veritas - Content Verification System

Veritas is a content verification and registration system that uses Hedera blockchain technology to verify the originality and authenticity of digital content.

## Overview

Veritas allows users to register and verify digital content using blockchain technology. The system registers the content by creating a unique hash, storing it on the Hedera distributed ledger, and generating embeddings for future similarity comparison. When verifying content, Veritas compares it against previously registered content to determine originality.

## Features

* **Content Registration** – Register digital content on the Hedera blockchain with associated metadata
* **Content Verification** – Check content originality against previously registered content
* **Similarity Detection** – Find similar content using embedding-based similarity matching
* **Blockchain-backed** – All registrations are secured by Hedera's distributed ledger technology
* **Multi-environment Support** – Deployment configurations for development, staging, and production

## Technical Architecture

The system is built on a modern tech stack:

* **Backend** – Python FastAPI application
* **Blockchain** – Hedera Hashgraph for immutable timestamping
* **AI/ML** – Sentence Transformers for semantic content analysis
* **Data Storage** – Redis for embedding and metadata storage
* **Deployment** – Docker containerized application

### System Components

1. **Content Registration Service**

   * Hashing of content for unique fingerprinting
   * Hedera integration for immutable timestamping
   * Metadata storage in Redis

2. **AI Verification Engine**

   * Generation of semantic embeddings for content
   * Similarity calculation between content pieces
   * Detection of potential plagiarism or derivative works

3. **API Layer**

   * Content registration endpoints
   * Verification endpoints
   * Health monitoring and metrics collection

## Project Structure

```
veritas/
├── app/
│   ├── api/
│   ├── models/
│   ├── services/
│   │   ├── hedera_service.py
│   │   ├── redis_service.py
│   │   └── verification_service.py
│   └── utils/
├── tests/
│   ├── test_api.py
│   ├── test_utils.py
│   └── test_verification.py
├── docker/
├── DockerFile
├── docker-compose.yml
└── requirements.txt
```

## Getting Started

### Prerequisites

* Python 3.9+
* Docker and Docker Compose
* Hedera Testnet Account
* Redis Server (or use Docker)

### Environment Setup

```bash
git clone https://github.com/yourusername/veritas.git
cd veritas
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Set up credentials and Redis config
```

### Running the Application

**Local Development**

```bash
uvicorn app.main:app --reload
```

**Docker Deployment**

```bash
docker-compose up -d
```

## API Documentation

### Register Content

**POST /api/register**

Registers content and stores its hash on the blockchain.

```json
{
  "content": "Your content here",
  "content_type": "text",
  "title": "Content Title",
  "author": "Author Name",
  "metadata": {}
}
```

### Verify Content

**POST /api/verify**

Verifies submitted content against existing records.

```json
{
  "content": "Content to verify",
  "content_type": "text",
  "threshold": 0.85
}
```

## Deployment

The application is containerized using Docker. Run the following to deploy:

```bash
docker-compose up -d
```

## Learning Outcomes

* Gained experience working with a **full stack Next.js application**, including server-side rendering and frontend-backend integration.
* Integrated **Python APIs** with a JavaScript frontend for the first time, learning how to structure and test endpoints.
* Used **Docker** to containerize the application, simplifying the development and deployment process across environments.
* Understood the advantages of using **Redis** for fast metadata and embedding lookups, particularly in verification workflows.
* Learned how to use **Hedera Hashgraph** for secure and immutable content registration, including managing credentials and submitting transactions.
* Explored lightweight **ML models** using Sentence Transformers to support semantic similarity checking, optimized for deployment on resource-constrained systems.
* Gained hands-on experience setting up a **CI/CD pipeline** using GitHub Actions for automated testing and deployment.
* Understood the value of **observability** by integrating Prometheus and Grafana to monitor system health and performance metrics.
