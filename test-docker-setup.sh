#!/bin/bash

echo "Testing Docker Compose Setup for Integral-X Monorepo"
echo "======================================================="

# Clean up any existing containers
echo "Cleaning up existing containers..."
docker-compose down -v

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Test API Gateway health
echo "Testing API Gateway health..."
curl -f http://localhost:4000/health || echo "❌ API Gateway health check failed"

# Test eBay Service health
echo "Testing eBay Service health..."
curl -f http://localhost:4100/health || echo "❌ eBay Service health check failed"

# Test eBay Service product endpoint
echo "Testing eBay Service product endpoint..."
curl -f http://localhost:4100/products/123 || echo "❌ eBay Service product endpoint failed"

# Test GraphQL endpoint
echo "Testing GraphQL endpoint..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health }"}' \
  http://localhost:4000/graphql || echo "❌ GraphQL endpoint failed"

# Show container status
echo "📊 Container Status:"
docker-compose ps

echo "✅ Docker setup test completed!"