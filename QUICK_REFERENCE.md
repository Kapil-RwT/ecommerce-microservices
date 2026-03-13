# Quick Reference Guide

## 🚀 Getting Started (30 seconds)

```bash
cd ecommerce-microservices
./start-services.sh
```

Wait 2-3 minutes for all services to start, then access:
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Grafana**: http://localhost:3000 (admin/admin)

## 📋 Service Ports

| Service | Port | Swagger UI |
|---------|------|------------|
| Eureka Server | 8761 | N/A |
| API Gateway | 8080 | N/A |
| User Service | 8081 | http://localhost:8081/swagger-ui.html |
| Product Service | 8082 | http://localhost:8082/swagger-ui.html |
| Inventory Service | 8083 | http://localhost:8083/swagger-ui.html |
| Payment Service | 8084 | http://localhost:8084/swagger-ui.html |
| Order Service | 8085 | http://localhost:8085/swagger-ui.html |
| Notification Service | 8086 | N/A |
| Prometheus | 9090 | N/A |
| Grafana | 3000 | N/A |

## 🔑 Quick API Test Flow

### 1. Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'
```

### 2. Login (Save the token)
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"test","password":"test123"}'
```

### 3. Create Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"iPhone","sku":"IPH001","price":999,"category":"Electronics","brand":"Apple","active":true}'
```

### 4. Add Inventory
```bash
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":1,"quantity":100,"reorderLevel":10}'
```

### 5. Create Order (Saga Pattern)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}],"shippingAddress":"123 Main St","billingAddress":"123 Main St","paymentMethod":"CREDIT_CARD"}'
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Scale a service
docker-compose up -d --scale order-service=3

# Check status
docker-compose ps

# Remove everything including volumes
docker-compose down -v
```

## 🔍 Monitoring & Debugging

### Check Service Health
```bash
curl http://localhost:8081/actuator/health
```

### View Metrics
```bash
curl http://localhost:8081/actuator/metrics
```

### Check Eureka Registry
Visit: http://localhost:8761

### View Prometheus Metrics
Visit: http://localhost:9090

### View Grafana Dashboards
Visit: http://localhost:3000 (admin/admin)

### Check Kafka Topics
```bash
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

### View Kafka Messages
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic payment-events \
  --from-beginning
```

## 🛠️ Troubleshooting

### Services Not Starting?
```bash
# Check Docker resources
docker stats

# Check logs
docker-compose logs -f

# Restart Docker Desktop
```

### Database Connection Issues?
```bash
# Check if PostgreSQL is running
docker-compose ps | grep postgres

# Connect to database
docker exec -it postgres-users psql -U postgres -d ecommerce_users
```

### Port Already in Use?
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Out of Memory?
```bash
# Increase Docker memory in Docker Desktop settings
# Recommended: 8GB minimum, 16GB ideal
```

## 📊 Project Statistics

- **Java Files**: 65+
- **Services**: 8 microservices
- **Databases**: 5 PostgreSQL instances
- **API Endpoints**: 50+
- **Docker Containers**: 20+
- **Lines of Code**: 10,000+

## 🎯 Key Concepts Demonstrated

1. **Microservices Architecture**
2. **Saga Pattern** (Order Service)
3. **Circuit Breaker** (Resilience4j)
4. **Service Discovery** (Eureka)
5. **API Gateway** (Spring Cloud Gateway)
6. **Event-Driven** (Kafka)
7. **Caching** (Redis)
8. **Search** (Elasticsearch)
9. **Security** (JWT)
10. **Monitoring** (Prometheus + Grafana)

## 📁 Important Files

- `pom.xml` - Parent POM with dependencies
- `docker-compose.yml` - Complete infrastructure setup
- `README.md` - Comprehensive documentation
- `ARCHITECTURE.md` - Architecture details
- `DEPLOYMENT.md` - Cloud deployment guides
- `POSTMAN_COLLECTION.md` - API testing guide
- `PROJECT_SUMMARY.md` - Project overview

## 🔗 Useful Links

- **Eureka**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Swagger UI**: http://localhost:808X/swagger-ui.html
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **PostgreSQL**: localhost:5432-5436
- **Redis**: localhost:6379
- **Elasticsearch**: localhost:9200
- **Kafka**: localhost:9092

## 💡 Interview Tips

### When discussing this project:

1. **Start with the big picture**: Microservices architecture with 8 services
2. **Highlight the Saga pattern**: Distributed transaction management
3. **Explain trade-offs**: Why microservices? What challenges did you solve?
4. **Discuss scalability**: How each component scales
5. **Talk about resilience**: Circuit breaker, retry logic, fallbacks
6. **Mention observability**: Monitoring, logging, health checks
7. **Cover security**: JWT, API Gateway authentication
8. **Explain data consistency**: Eventual consistency via events

### Key Talking Points:

- "I implemented the Saga pattern to handle distributed transactions across Order, Payment, and Inventory services"
- "Used circuit breaker pattern to prevent cascading failures"
- "Implemented multi-level caching with Redis for performance"
- "Used Elasticsearch for full-text product search"
- "Kafka for event-driven async communication"
- "Complete observability with Prometheus and Grafana"

## 🎓 Learning Resources

- Spring Boot: https://spring.io/projects/spring-boot
- Spring Cloud: https://spring.io/projects/spring-cloud
- Microservices Patterns: https://microservices.io/patterns/
- Docker: https://docs.docker.com/
- Kubernetes: https://kubernetes.io/docs/

## 📞 Need Help?

1. Check the logs: `docker-compose logs -f [service-name]`
2. Review README.md for detailed documentation
3. Check ARCHITECTURE.md for design decisions
4. See DEPLOYMENT.md for deployment guides
5. Use POSTMAN_COLLECTION.md for API testing

## ⚡ Quick Commands Cheat Sheet

```bash
# Build everything
./build-all.sh

# Start everything
./start-services.sh

# Stop everything
docker-compose down

# Clean build
mvn clean install -DskipTests

# Run tests
mvn test

# Check service health
curl localhost:8081/actuator/health

# View all containers
docker ps

# View all images
docker images

# Clean Docker
docker system prune -a

# View logs
docker-compose logs -f order-service
```

---

**Happy Coding! 🚀**
