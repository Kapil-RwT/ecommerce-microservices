#!/bin/bash

echo "========================================="
echo "E-Commerce Microservices - Codespaces Build"
echo "========================================="
echo ""

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "🔨 Building all services with Maven..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ Build completed successfully!"
    echo "========================================="
    echo ""
    echo "Next steps:"
    echo "1. Start services: docker-compose up -d"
    echo "2. Check status: docker-compose ps"
    echo "3. View logs: docker-compose logs -f [service-name]"
    echo ""
    echo "Services will be available at:"
    echo "  - Eureka Dashboard: http://localhost:8761"
    echo "  - API Gateway: http://localhost:8080"
    echo "  - User Service: http://localhost:8081"
    echo "  - Product Service: http://localhost:8082"
    echo "  - Order Service: http://localhost:8083"
    echo "  - Payment Service: http://localhost:8084"
    echo "  - Inventory Service: http://localhost:8085"
    echo "========================================="
else
    echo ""
    echo "========================================="
    echo "❌ Build failed! Check the errors above."
    echo "========================================="
    exit 1
fi
