# E-Commerce Microservices Platform

A comprehensive, production-ready e-commerce platform built with Spring Boot microservices architecture, demonstrating industry best practices and modern distributed systems patterns.

## ⚡ Quick Start with GitHub Codespaces (Recommended)

**Run this entire platform in the cloud with one click - no local setup needed!**

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new)

1. Push this code to GitHub
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait 2 minutes for setup
4. Run: `./build-all.sh && docker-compose up -d`
5. Access services via forwarded ports

**👉 [Complete Codespaces Setup Guide](./GITHUB_SETUP.md)**

## 🏗️ Architecture Overview

This project implements a complete e-commerce system using microservices architecture with the following services:

### Core Services
- **Eureka Server** (8761) - Service Discovery
- **API Gateway** (8080) - Entry point, routing, authentication, rate limiting
- **User Service** (8081) - User management and authentication
- **Product Service** (8082) - Product catalog with Elasticsearch
- **Inventory Service** (8083) - Stock management with pessimistic locking
- **Payment Service** (8084) - Payment processing
- **Order Service** (8085) - Order management with Saga pattern
- **Notification Service** (8086) - Async notifications via Kafka

### Infrastructure Components
- **PostgreSQL** - Database for each service (Database per service pattern)
- **Redis** - Caching and session management
- **Elasticsearch** - Product search and indexing
- **Kafka** - Event-driven async communication
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards

## 🚀 Key Features & Concepts

### Microservices Patterns
✅ **Service Discovery** - Eureka for dynamic service registration  
✅ **API Gateway** - Centralized routing and cross-cutting concerns  
✅ **Circuit Breaker** - Resilience4j for fault tolerance  
✅ **Saga Pattern** - Distributed transaction management  
✅ **Event Sourcing** - Kafka for async communication  
✅ **CQRS** - Separate read/write models with Elasticsearch  
✅ **Database per Service** - Independent data stores  

### Security
✅ **JWT Authentication** - Token-based auth across services  
✅ **Spring Security** - Role-based access control  
✅ **API Gateway Auth Filter** - Centralized authentication  

### Performance & Scalability
✅ **Redis Caching** - Multi-level caching strategy  
✅ **Elasticsearch** - Fast full-text search  
✅ **Connection Pooling** - Optimized database connections  
✅ **Async Processing** - Kafka for non-blocking operations  
✅ **Rate Limiting** - API throttling at gateway level  

### Data Management
✅ **Optimistic Locking** - Version-based concurrency control  
✅ **Pessimistic Locking** - Inventory reservation  
✅ **Transaction Management** - ACID compliance per service  
✅ **Data Validation** - Bean validation across all services  

### Observability
✅ **Spring Boot Actuator** - Health checks and metrics  
✅ **Prometheus** - Metrics aggregation  
✅ **Grafana** - Visualization dashboards  
✅ **Distributed Logging** - Structured logging  

### DevOps
✅ **Docker** - Containerization  
✅ **Docker Compose** - Local orchestration  
✅ **CI/CD Pipeline** - GitHub Actions  
✅ **Health Checks** - Service health monitoring  

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.8+
- Docker & Docker Compose
- 8GB RAM minimum (16GB recommended)

## 🛠️ Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-microservices

# Make scripts executable
chmod +x build-all.sh start-services.sh

# Build and start all services
./start-services.sh
```

### Option 2: Manual Build

```bash
# Build common library
cd common-lib && mvn clean install && cd ..

# Build all services
./build-all.sh

# Start infrastructure
docker-compose up -d postgres-users postgres-products postgres-inventory postgres-payments postgres-orders redis elasticsearch kafka zookeeper

# Start services individually
cd eureka-server && mvn spring-boot:run &
cd api-gateway && mvn spring-boot:run &
cd user-service && mvn spring-boot:run &
# ... repeat for other services
```

## 📊 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Eureka Dashboard | http://localhost:8761 | Service registry |
| API Gateway | http://localhost:8080 | Main entry point |
| User Service | http://localhost:8081/swagger-ui.html | User management |
| Product Service | http://localhost:8082/swagger-ui.html | Product catalog |
| Inventory Service | http://localhost:8083/swagger-ui.html | Stock management |
| Payment Service | http://localhost:8084/swagger-ui.html | Payments |
| Order Service | http://localhost:8085/swagger-ui.html | Orders |
| Prometheus | http://localhost:9090 | Metrics |
| Grafana | http://localhost:3000 | Dashboards (admin/admin) |

## 🔐 API Examples

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john_doe",
    "password": "password123"
  }'
```

### 3. Create a Product

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 Pro chip",
    "sku": "IPH15PRO-256-BLK",
    "price": 999.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true,
    "featured": true
  }'
```

### 4. Add Inventory

```bash
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "productId": 1,
    "quantity": 100,
    "reorderLevel": 10,
    "maxStockLevel": 500
  }'
```

### 5. Create an Order (Saga Pattern in Action)

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, State 12345",
    "billingAddress": "123 Main St, City, State 12345",
    "paymentMethod": "CREDIT_CARD"
  }'
```

### 6. Search Products

```bash
curl "http://localhost:8080/api/products/search?keyword=iPhone&page=0&size=10"
```

## 🏛️ Architecture Decisions

### Why Saga Pattern?
The Order Service implements the Saga pattern to handle distributed transactions across multiple services (Inventory, Payment). This ensures data consistency without using distributed transactions (2PC), which are difficult to scale.

**Order Creation Flow:**
1. Create order (PENDING)
2. Reserve inventory → Success/Fail
3. Process payment → Success/Fail
4. Confirm inventory → Success/Fail
5. Mark order as CONFIRMED

If any step fails, compensating transactions are executed to rollback previous steps.

### Why Database per Service?
Each microservice has its own database to ensure:
- Service independence
- Technology flexibility
- Scalability
- Fault isolation

### Why Elasticsearch?
Product search requires:
- Full-text search capabilities
- Fast query performance
- Relevance scoring
- Autocomplete functionality

PostgreSQL alone cannot efficiently handle these requirements at scale.

### Why Kafka?
Asynchronous communication between services for:
- Event-driven architecture
- Decoupling services
- Reliable message delivery
- Event sourcing capabilities

## 📈 Performance Optimizations

1. **Caching Strategy**
   - L1: Application cache (Caffeine)
   - L2: Redis distributed cache
   - Cache invalidation on updates

2. **Database Optimizations**
   - Connection pooling (HikariCP)
   - Indexed columns
   - Optimistic/Pessimistic locking where appropriate

3. **API Gateway**
   - Request rate limiting
   - Response caching
   - Connection pooling

4. **Async Processing**
   - Kafka for non-blocking operations
   - CompletableFuture for parallel processing

## 🧪 Testing

```bash
# Run all tests
mvn clean test

# Run tests for specific service
cd user-service && mvn test

# Integration tests
mvn verify
```

## 📦 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Scale a service
docker-compose up -d --scale order-service=3

# View logs
docker-compose logs -f order-service

# Stop all services
docker-compose down
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests (create these based on your needs)
kubectl apply -f k8s/

# Check pod status
kubectl get pods

# View logs
kubectl logs -f <pod-name>
```

### Cloud Deployment

The project is ready to deploy on:
- **AWS**: ECS, EKS, or Elastic Beanstalk
- **Azure**: AKS or Container Instances
- **GCP**: GKE or Cloud Run

## 🔧 Configuration

Each service can be configured via:
1. `application.yml` - Default configuration
2. `application-docker.yml` - Docker-specific config
3. Environment variables
4. Spring Cloud Config Server (can be added)

## 📊 Monitoring

### Prometheus Metrics
- JVM metrics (memory, threads, GC)
- HTTP request metrics
- Custom business metrics
- Database connection pool metrics

### Grafana Dashboards
Access Grafana at http://localhost:3000 (admin/admin)

Pre-configured dashboards for:
- Service health overview
- Request rates and latencies
- Error rates
- Database performance
- JVM metrics

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check Docker resources
docker stats

# Check service logs
docker-compose logs -f <service-name>

# Restart a service
docker-compose restart <service-name>
```

### Database connection issues?
```bash
# Check if PostgreSQL is running
docker-compose ps postgres-users

# Connect to database
docker exec -it postgres-users psql -U postgres -d ecommerce_users
```

### Kafka issues?
```bash
# Check Kafka topics
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# View consumer groups
docker exec -it kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list
```

## 📚 Technology Stack

- **Framework**: Spring Boot 3.2.3
- **Java**: 17
- **Build Tool**: Maven
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Circuit Breaker**: Resilience4j
- **Databases**: PostgreSQL 15
- **Cache**: Redis 7
- **Search**: Elasticsearch 8.11
- **Message Broker**: Apache Kafka
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker
- **Documentation**: SpringDoc OpenAPI (Swagger)

## 🎯 Interview Talking Points

This project demonstrates:

1. **Microservices Architecture** - Service decomposition, independence, and communication
2. **Distributed Systems** - Saga pattern, eventual consistency, distributed transactions
3. **Scalability** - Horizontal scaling, load balancing, caching strategies
4. **Resilience** - Circuit breakers, retries, fallbacks, timeouts
5. **Security** - JWT authentication, role-based access control
6. **Data Management** - Database per service, event sourcing, CQRS
7. **Observability** - Logging, metrics, tracing, health checks
8. **DevOps** - Containerization, CI/CD, infrastructure as code
9. **Performance** - Caching, async processing, connection pooling
10. **Best Practices** - Clean code, SOLID principles, design patterns

## 📝 License

This project is created for educational and portfolio purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you learn microservices architecture!
