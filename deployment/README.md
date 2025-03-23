# Deployment Guide

This guide covers the deployment of the Veritas system in various environments.

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- Hedera account credentials
- Environment variables configured

### Steps

1. Build the Docker image:

```bash
docker build -t veritas-app:latest -f docker/Dockerfile .
```

2. Create a docker-compose.yml file:

```yaml
version: '3'
services:
  redis:
    image: redis:6.2
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    
  veritas:
    image: veritas-app:latest
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - HEDERA_ACCOUNT_ID=${HEDERA_ACCOUNT_ID}
      - HEDERA_PRIVATE_KEY=${HEDERA_PRIVATE_KEY}
      - HEDERA_NETWORK=${HEDERA_NETWORK}
    depends_on:
      - redis

volumes:
  redis_data:
```

3. Start the services:

```bash
docker-compose up -d
```

## Manual Deployment

### Prerequisites

- Python 3.9+
- Redis Server (v6.2+)
- Hedera Testnet Account
- Virtual environment

### Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/veritas.git
cd veritas
```

2. Create and activate a virtual environment:

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
cp .env.example .env
# Edit .env with your settings
```

5. Start the application:

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

## Production Considerations

- Use a production-grade ASGI server like Gunicorn with Uvicorn workers
- Set up proper monitoring and logging
- Configure HTTPS with a reverse proxy (Nginx or similar)
- Set appropriate resource limits and scaling policies

## Monitoring

Consider implementing:
- Prometheus metrics
- Grafana dashboards
- Log aggregation (ELK stack or similar)
- Health check endpoints
