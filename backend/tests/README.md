# Tests Module

This directory contains the test suite for the Veritas IP Registry & Verification System.

## Overview

The test suite verifies the functionality of core components using pytest. Tests are organized by component area and use mock objects to isolate functionality under test.

## Test Files

- **test_verification.py**: Tests for the AI-powered content verification service, including embedding generation, similarity calculation, and content matching.

- **test_utils.py**: Tests for utility functions including content hash generation, timestamp handling, and Hedera serialization.

- **test_api.py**: Integration tests for API endpoints including content registration, verification, and health check functionality.

## Setup

- **conftest.py**: Configuration file that adds the project root to the Python path.

- **__init__.py**: Package initialization file.

## Running the Tests

To run all tests:

```bash
pytest
```

To run tests for a specific component:

```bash
pytest tests/test_verification.py
```

To run tests with verbose output:

```bash
pytest -v
```

## Testing Strategy

1. **Unit Tests**: Individual functions and methods are tested in isolation with dependencies mocked.
2. **Service Tests**: Service layer functionality is tested with external dependencies mocked.
3. **API Tests**: Endpoints are tested using FastAPI's TestClient.

## Mocking

The tests extensively use Python's unittest.mock to:
- Mock the Redis service for data persistence testing
- Mock the Hedera service for blockchain interactions
- Mock embedding generation to avoid costly ML operations during testing
- Simulate API responses without external dependencies

## Coverage

The test suite covers:
- Content hash generation and verification
- Embedding generation and similarity calculation
- API endpoint functionality
- Utility functions for timestamps and serialization
