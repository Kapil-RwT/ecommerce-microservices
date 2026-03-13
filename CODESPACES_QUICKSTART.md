# 🚀 Codespaces Quick Start Guide

## Step 1: Pull Latest Changes
```bash
git pull origin main
```

## Step 2: Build All Services
```bash
mvn clean install -DskipTests
```

**Expected:** All services should compile successfully ✅

## Step 3: Start Infrastructure & Services
```bash
docker-compose up -d
```

## Step 4: Check Service Status
```bash
docker-compose ps
```

**Expected:** All containers should be "Up" or "healthy"

## Step 5: View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f eureka-server
docker-compose logs -f user-service
docker-compose logs -f product-service
```

## Step 6: Access Services

### Service URLs (in Codespaces, these will be forwarded ports):
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **User Service**: http://localhost:8081
- **Product Service**: http://localhost:8082
- **Order Service**: http://localhost:8083
- **Payment Service**: http://localhost:8084
- **Inventory Service**: http://localhost:8085

### Infrastructure URLs:
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 🔧 Useful Commands

### Stop All Services
```bash
docker-compose down
```

### Restart a Specific Service
```bash
docker-compose restart user-service
```

### Rebuild a Service
```bash
# Rebuild Maven artifact
cd user-service
mvn clean package -DskipTests
cd ..

# Rebuild Docker image
docker-compose build user-service

# Restart the service
docker-compose up -d user-service
```

### View Resource Usage
```bash
docker stats
```

### Clean Up Everything
```bash
docker-compose down -v  # Removes volumes too
```

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "stockQuantity": 100,
    "category": "Electronics"
  }'
```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs service-name

# Check if port is already in use
lsof -i :8080

# Restart the service
docker-compose restart service-name
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres-users

# View PostgreSQL logs
docker-compose logs postgres-users
```

### Eureka Registration Issues
```bash
# Check Eureka logs
docker-compose logs eureka-server

# Verify service can reach Eureka
docker-compose exec user-service ping eureka-server
```

### Out of Memory
```bash
# Check memory usage
docker stats

# Increase Docker memory limit in Codespaces settings
# Or restart with fewer services
```

## 📊 Monitoring

### Check Service Health
```bash
curl http://localhost:8081/actuator/health
```

### View Metrics
```bash
curl http://localhost:8081/actuator/metrics
```

### Prometheus Targets
Visit http://localhost:9090/targets to see all monitored services

## 🎯 Next Steps

1. ✅ All services running
2. Test the API endpoints
3. View Eureka Dashboard to confirm service registration
4. Check Grafana dashboards for metrics
5. Review logs for any warnings or errors

## 📚 Additional Resources

- **Architecture Diagram**: See `ARCHITECTURE.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Postman Collection**: See `POSTMAN_COLLECTION.md`

---

**Need Help?** Check the logs first: `docker-compose logs -f`
