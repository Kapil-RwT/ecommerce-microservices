# 🚀 GitHub Codespaces Setup Guide

This guide will help you run the E-Commerce Microservices Platform on GitHub Codespaces - completely free and in the cloud!

## 📋 Prerequisites

- A GitHub account (free tier includes 60 hours/month of Codespaces)
- That's it! Everything else is handled automatically.

## 🎯 Quick Start (5 Minutes)

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
cd ecommerce-microservices
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: E-Commerce Microservices Platform"

# Create a new repository on GitHub (via web interface)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-microservices.git
git branch -M main
git push -u origin main
```

### Step 2: Open in Codespaces

1. Go to your GitHub repository
2. Click the green **"Code"** button
3. Click on **"Codespaces"** tab
4. Click **"Create codespace on main"**

Wait 2-3 minutes for the environment to set up automatically.

### Step 3: Start the Application

Once your Codespace is ready, open the terminal and run:

```bash
# Start all services with Docker Compose
./start-services.sh
```

That's it! 🎉

## 📊 Accessing Services

GitHub Codespaces will automatically forward ports. You'll see notifications for:

- **API Gateway**: Port 8080 (Main entry point)
- **Eureka Dashboard**: Port 8761 (Service registry)
- **Grafana**: Port 3000 (Monitoring dashboards)
- **Prometheus**: Port 9090 (Metrics)

Click on the port forwarding notifications or go to the **PORTS** tab in VS Code to access the URLs.

## 🧪 Testing the APIs

### 1. Register a User

```bash
curl -X POST https://YOUR-CODESPACE-URL-8080.app.github.dev/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890"
  }'
```

### 2. Login

```bash
curl -X POST https://YOUR-CODESPACE-URL-8080.app.github.dev/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

Save the JWT token from the response.

### 3. Create a Product (Admin)

```bash
curl -X POST https://YOUR-CODESPACE-URL-8080.app.github.dev/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling headphones",
    "sku": "WH-1000XM4",
    "price": 299.99,
    "category": "Electronics",
    "brand": "TechBrand",
    "active": true
  }'
```

### 4. Add Inventory

```bash
curl -X POST https://YOUR-CODESPACE-URL-8080.app.github.dev/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 100,
    "reservedQuantity": 0
  }'
```

### 5. Create an Order

```bash
curl -X POST https://YOUR-CODESPACE-URL-8080.app.github.dev/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, Country",
    "paymentMethod": "CREDIT_CARD"
  }'
```

## 🔍 Monitoring & Observability

### Eureka Dashboard
- URL: `https://YOUR-CODESPACE-URL-8761.app.github.dev`
- View all registered microservices

### Grafana Dashboards
- URL: `https://YOUR-CODESPACE-URL-3000.app.github.dev`
- Username: `admin`
- Password: `admin`

### Prometheus Metrics
- URL: `https://YOUR-CODESPACE-URL-9090.app.github.dev`

## 🛠️ Development Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
docker-compose logs -f order-service
```

### Restart a Service
```bash
docker-compose restart user-service
```

### Stop All Services
```bash
docker-compose down
```

### Rebuild After Code Changes
```bash
# Rebuild all services
mvn clean package -DskipTests

# Rebuild Docker images
docker-compose build

# Start with new images
docker-compose up -d
```

## 📦 What's Running?

When you run `./start-services.sh`, the following services start:

### Microservices (8 services)
1. **Eureka Server** (8761) - Service Discovery
2. **API Gateway** (8080) - Entry point for all requests
3. **User Service** (8081) - User management & authentication
4. **Product Service** (8082) - Product catalog
5. **Inventory Service** (8083) - Stock management
6. **Payment Service** (8084) - Payment processing
7. **Order Service** (8085) - Order orchestration
8. **Notification Service** (8086) - Email/SMS notifications

### Infrastructure (9 services)
1. **PostgreSQL** (5432) - 5 separate databases
2. **Redis** (6379) - Caching
3. **Kafka + Zookeeper** (9092) - Event streaming
4. **Elasticsearch** (9200) - Product search
5. **Prometheus** (9090) - Metrics collection
6. **Grafana** (3000) - Visualization

## 💡 Tips & Tricks

### 1. Keep Codespace Active
Codespaces auto-suspend after 30 minutes of inactivity. Keep a terminal open or set a longer timeout:
- Go to Settings → Codespaces → Default idle timeout

### 2. Port Visibility
Make ports public if you want to share URLs:
- Right-click on a port in the PORTS tab
- Select "Port Visibility" → "Public"

### 3. Resource Usage
Monitor your Codespace usage at: https://github.com/settings/billing

### 4. Faster Startup
After first run, services start much faster due to Docker layer caching.

## 🐛 Troubleshooting

### Services Not Starting?
```bash
# Check Docker status
docker ps

# Check logs
docker-compose logs

# Restart everything
docker-compose down
docker-compose up -d
```

### Port Already in Use?
```bash
# Kill all Docker containers
docker-compose down

# Remove all containers
docker rm -f $(docker ps -aq)
```

### Out of Memory?
Codespaces free tier has 4GB RAM. If services crash:
```bash
# Start only essential services
docker-compose up -d postgres-users postgres-products postgres-orders redis eureka-server api-gateway user-service product-service order-service
```

## 🎓 For Interview Preparation

When discussing this project in interviews, highlight:

1. **Microservices Architecture** - 8 independent services
2. **Service Discovery** - Eureka for dynamic service registration
3. **API Gateway Pattern** - Single entry point with routing
4. **Distributed Transactions** - Saga pattern implementation
5. **Event-Driven Architecture** - Kafka for async communication
6. **Circuit Breaker** - Resilience4j for fault tolerance
7. **Observability** - Prometheus + Grafana monitoring
8. **Containerization** - Docker & Docker Compose
9. **Security** - JWT authentication, OAuth2 ready
10. **Search** - Elasticsearch for product search
11. **Caching** - Redis for performance
12. **Database per Service** - Each service has its own DB

## 📚 Additional Resources

- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.txt)
- [Detailed Architecture](./ARCHITECTURE.md)
- [API Documentation](./POSTMAN_COLLECTION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Need Help?

If you encounter any issues:
1. Check the logs: `docker-compose logs -f`
2. Verify all containers are running: `docker ps`
3. Restart services: `docker-compose restart`
4. Full reset: `docker-compose down -v && docker-compose up -d`

---

**Happy Coding! 🚀**

Your microservices platform is now running in the cloud, accessible from anywhere!
