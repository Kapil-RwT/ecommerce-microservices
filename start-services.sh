#!/bin/bash

echo "========================================="
echo "Starting E-Commerce Microservices"
echo "========================================="

# Build all services first
./build-all.sh

# Start Docker Compose
echo "Starting Docker Compose..."
docker-compose up -d

echo "========================================="
echo "Services are starting..."
echo "Please wait for all services to be healthy"
echo "========================================="
echo ""
echo "Service URLs:"
echo "- Eureka Server: http://localhost:8761"
echo "- API Gateway: http://localhost:8080"
echo "- User Service: http://localhost:8081/swagger-ui.html"
echo "- Product Service: http://localhost:8082/swagger-ui.html"
echo "- Inventory Service: http://localhost:8083/swagger-ui.html"
echo "- Payment Service: http://localhost:8084/swagger-ui.html"
echo "- Order Service: http://localhost:8085/swagger-ui.html"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3000 (admin/admin)"
echo ""
echo "To check logs: docker-compose logs -f [service-name]"
echo "To stop all services: docker-compose down"
echo "========================================="
