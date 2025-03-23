# IP Registration Service

The IP Registration Service is responsible for managing content fingerprinting and Hedera integration in the Veritas system.

## Features

- Content hash generation using SHA-256
- Submission to Hedera Consensus Service (HCS)
- Registration receipt management
- Immutable timestamping of content

## How It Works

1. Content is submitted to the service
2. A unique fingerprint (SHA-256 hash) is generated
3. The hash is recorded on Hedera Hashgraph with a timestamp
4. A registration receipt is generated for the user
5. Content metadata is stored in Redis for quick lookup

## Usage

```python
from ip_registration.service import IPRegistrationService

# Initialize the service
registration_service = IPRegistrationService(
    hedera_client=hedera_client,
    redis_client=redis_client
)

# Register content
receipt = await registration_service.register_content(
    content="My original content to register",
    author_id="user123",
    content_type="text"
)

# Verify registration
verification = await registration_service.verify_registration(receipt.transaction_id)
```

## Configuration

The service requires:
- Hedera account ID and private key
- Hedera network (testnet/mainnet)
- Redis connection parameters

## Dependencies

- `hedera-sdk-py`: For interaction with Hedera Hashgraph
- `redis`: For caching fingerprints and metadata
- `hashlib`: For generating SHA-256 fingerprints
