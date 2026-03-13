#!/bin/bash

echo "========================================="
echo "Building E-Commerce Microservices"
echo "========================================="

# Build common library first
echo "Building common-lib..."
cd common-lib && mvn clean install -DskipTests && cd ..

# Build all services
services=("eureka-server" "api-gateway" "user-service" "product-service" "inventory-service" "payment-service" "order-service" "notification-service")

for service in "${services[@]}"
do
    echo "Building $service..."
    cd $service && mvn clean package -DskipTests && cd ..
done

echo "========================================="
echo "Build completed successfully!"
echo "========================================="
