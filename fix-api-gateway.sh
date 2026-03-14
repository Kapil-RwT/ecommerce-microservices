#!/bin/bash

echo "🔧 Fixing API Gateway..."
echo ""

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop the current API Gateway
echo "🛑 Stopping API Gateway..."
docker-compose stop api-gateway

# Rebuild the API Gateway
echo "🔨 Rebuilding API Gateway..."
cd api-gateway
mvn clean package -DskipTests
cd ..

# Restart with the new build
echo "🚀 Starting API Gateway..."
docker-compose up -d --build api-gateway

echo ""
echo "✅ Done! Checking status..."
sleep 5
docker-compose logs --tail=50 api-gateway

echo ""
echo "🔍 To continue monitoring:"
echo "  docker-compose logs -f api-gateway"
