#!/bin/bash

echo "========================================="
echo "  E-Commerce Microservices - Full Rebuild"
echo "========================================="
echo ""

# Pull latest changes
echo "📥 Step 1: Pulling latest changes..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts first."
    exit 1
fi

# Stop all containers
echo ""
echo "🛑 Step 2: Stopping all containers..."
docker-compose down
echo "  ✅ Containers stopped."

# Build common-lib first (required by all services)
echo ""
echo "🔨 Step 3: Building common-lib..."
cd common-lib && mvn clean install -DskipTests -q && cd ..
if [ $? -ne 0 ]; then
    echo "❌ common-lib build failed!"
    exit 1
fi
echo "  ✅ common-lib built."

# Build all services
SERVICES="eureka-server api-gateway user-service product-service inventory-service payment-service order-service notification-service"

for service in $SERVICES; do
    echo ""
    echo "🔨 Step 3: Building $service..."
    cd $service && mvn clean package -DskipTests -q && cd ..
    if [ $? -ne 0 ]; then
        echo "❌ $service build failed!"
        exit 1
    fi
    echo "  ✅ $service built."
done

# Docker compose build and start
echo ""
echo "🐳 Step 4: Building Docker images..."
docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "🚀 Step 5: Starting infrastructure (DB, Redis, Kafka, Elasticsearch)..."
docker-compose up -d postgres-users postgres-products postgres-inventory postgres-payments postgres-orders redis zookeeper elasticsearch prometheus grafana
echo "  Waiting 20s for infrastructure to be ready..."
sleep 20

echo ""
echo "🚀 Step 6: Starting Eureka Server..."
docker-compose up -d eureka-server
echo "  Waiting 30s for Eureka to be ready..."
sleep 30

echo ""
echo "🚀 Step 7: Starting Kafka (needs Zookeeper)..."
docker-compose up -d kafka
echo "  Waiting 20s for Kafka to be ready..."
sleep 20

echo ""
echo "🚀 Step 8: Starting all microservices..."
docker-compose up -d api-gateway user-service product-service inventory-service payment-service order-service notification-service

echo ""
echo "========================================="
echo "  ✅ ALL SERVICES STARTED!"
echo "========================================="
echo ""
echo "Wait 30-60 seconds for services to register with Eureka."
echo ""
echo "📊 Service URLs:"
echo "  Eureka Dashboard:  http://localhost:8761"
echo "  API Gateway:       http://localhost:8080"
echo "  User Service:      http://localhost:8081"
echo "  Product Service:   http://localhost:8082"
echo "  Inventory Service: http://localhost:8083"
echo "  Payment Service:   http://localhost:8084"
echo "  Order Service:     http://localhost:8085"
echo "  Notification:      http://localhost:8086"
echo "  Prometheus:        http://localhost:9090"
echo "  Grafana:           http://localhost:3000 (admin/admin)"
echo ""
echo "🧪 Quick Test:"
echo "  curl http://localhost:8080/api/users/register -X POST -H 'Content-Type: application/json' -d '{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"Test1234!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"USER\"}'"
echo ""
echo "📋 Check service status:"
echo "  docker-compose ps"
echo "  docker-compose logs --tail=20 [service-name]"
