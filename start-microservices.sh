#!/bin/bash

echo "========================================="
echo "Starting E-Commerce Microservices"
echo "========================================="
echo ""

echo "📊 Current Status:"
docker-compose ps

echo ""
echo "🚀 Starting all microservices..."
echo ""

# Start services one by one
services=("api-gateway" "user-service" "product-service" "inventory-service" "payment-service" "order-service" "notification-service")

for service in "${services[@]}"; do
    echo "▶️  Starting $service..."
    docker-compose up -d $service
    sleep 5
done

echo ""
echo "========================================="
echo "✅ All services started!"
echo "========================================="
echo ""

echo "📊 Final Status:"
docker-compose ps

echo ""
echo "🔍 To view logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "🌐 Service URLs:"
echo "  - Eureka Dashboard: http://localhost:8761"
echo "  - API Gateway: http://localhost:8080"
echo "  - User Service: http://localhost:8081"
echo "  - Product Service: http://localhost:8082"
echo "  - Inventory Service: http://localhost:8083"
echo "  - Payment Service: http://localhost:8084"
echo "  - Order Service: http://localhost:8085"
echo "  - Notification Service: http://localhost:8086"
echo ""
