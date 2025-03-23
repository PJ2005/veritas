#!/bin/bash

# Veritas Deployment Script
# Usage: ./deploy.sh [dev|staging|prod] [version]

# Check if the environment is provided
if [ -z "$1" ]; then
  echo "Error: Environment not specified"
  echo "Usage: ./deploy.sh [dev|staging|prod] [version]"
  exit 1
fi

# Set environment and version
ENV=$1
VERSION=${2:-latest}

echo "Deploying Veritas version $VERSION to $ENV environment..."

# Navigate to the appropriate directory
cd "$(dirname "$0")/$ENV" || exit 1

# Check if .env file exists
if [ ! -f .env.$ENV ]; then
  echo "Error: .env.$ENV file not found"
  echo "Please create .env.$ENV file based on .env.$ENV.example"
  exit 1
fi

# Set the version in the environment
export VERSION=$VERSION

# Deploy using docker-compose
if [ "$ENV" == "prod" ]; then
  echo "Production deployment..."
  docker-compose -f docker-compose.yml down
  docker-compose -f docker-compose.yml up -d
else
  echo "Development/Staging deployment..."
  docker-compose -f docker-compose.yml down
  docker-compose -f docker-compose.yml up -d
fi

echo "Deployment completed!"
