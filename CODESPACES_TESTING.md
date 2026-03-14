# 🧪 Codespaces Testing Guide

## ✅ Current Status

Your E-Commerce Microservices Platform is **RUNNING** in GitHub Codespaces! 🎉

### Infrastructure Services (All Healthy ✅)
- ✅ PostgreSQL (5 databases)
- ✅ Redis
- ✅ Elasticsearch
- ✅ Kafka + Zookeeper

### Eureka Server
- ✅ **Running** on port 8761
- ⚠️ Health check shows "unhealthy" but server is operational (health check will be fixed on next restart)

---

## 🚀 Step 1: Start All Microservices

In your Codespaces terminal, run:

```bash
./start-microservices.sh
```

This will start all 7 microservices:
1. API Gateway (port 8080)
2. User Service (port 8081)
3. Product Service (port 8082)
4. Inventory Service (port 8083)
5. Payment Service (port 8084)
6. Order Service (port 8085)
7. Notification Service (port 8086)

---

## 🔍 Step 2: Monitor Service Registration

### Check Eureka Dashboard

1. In Codespaces, go to the **PORTS** tab
2. Find port **8761** and click the **globe icon** to open in browser
3. You should see the Eureka Dashboard with all services registered

### Expected Services in Eureka:
- API-GATEWAY
- USER-SERVICE
- PRODUCT-SERVICE
- INVENTORY-SERVICE
- PAYMENT-SERVICE
- ORDER-SERVICE
- NOTIFICATION-SERVICE

**Note:** It may take 30-60 seconds for all services to register with Eureka.

---

## 🧪 Step 3: Test the APIs

### Option 1: Using the PORTS Tab (Recommended for Codespaces)

1. Go to the **PORTS** tab in Codespaces
2. Find port **8080** (API Gateway)
3. Click the **globe icon** to get the public URL
4. Use that URL for all API calls below

### Option 2: Using curl in Terminal

Replace `<YOUR_CODESPACE_URL>` with your actual Codespace URL from the PORTS tab.

---

## 📝 API Test Sequence

### 1. Register a New User

```bash
curl -X POST <YOUR_CODESPACE_URL>/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Login

```bash
curl -X POST <YOUR_CODESPACE_URL>/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe"
    }
  }
}
```

**💡 IMPORTANT:** Copy the `token` value - you'll need it for authenticated requests!

---

### 3. Create a Product (Requires Authentication)

Replace `<YOUR_TOKEN>` with the token from Step 2:

```bash
curl -X POST <YOUR_CODESPACE_URL>/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "MacBook Pro 16",
    "description": "Powerful laptop for developers",
    "price": 2499.99,
    "category": "ELECTRONICS",
    "stockQuantity": 50
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "MacBook Pro 16",
    "price": 2499.99,
    "stockQuantity": 50
  }
}
```

---

### 4. Get All Products

```bash
curl <YOUR_CODESPACE_URL>/api/products
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "MacBook Pro 16",
        "price": 2499.99
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

---

### 5. Create an Order (Requires Authentication)

```bash
curl -X POST <YOUR_CODESPACE_URL>/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1
      }
    ],
    "shippingAddress": "123 Main St, San Francisco, CA 94105",
    "paymentMethod": "CREDIT_CARD"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "status": "PENDING",
    "totalAmount": 2499.99,
    "items": [...]
  }
}
```

---

## 🔍 Step 4: Monitor Logs

### View All Service Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f order-service
```

### What to Look For:
- ✅ Services registering with Eureka
- ✅ Database connections successful
- ✅ Kafka consumer groups starting
- ✅ API requests being processed

---

## 📊 Step 5: Check Service Health

### Eureka Dashboard
- URL: `http://localhost:8761` (use Codespaces port forwarding)
- Shows all registered services

### Actuator Endpoints
Each service exposes health endpoints:

```bash
curl <YOUR_CODESPACE_URL>/actuator/health
```

---

## 🎯 Expected Behavior

### ✅ Success Indicators:
1. All 7 microservices appear in Eureka Dashboard
2. User registration returns a success response
3. Login returns a JWT token
4. Product creation works with authentication
5. Order creation triggers:
   - Inventory check
   - Payment processing
   - Kafka events
   - Notification service

### 🔄 Inter-Service Communication:
When you create an order, you should see:
1. **Order Service** → Validates request
2. **Product Service** → Fetches product details
3. **Inventory Service** → Checks/reserves stock
4. **Payment Service** → Processes payment
5. **Notification Service** → Sends confirmation (check logs)

---

## 🐛 Troubleshooting

### If a service doesn't start:
```bash
# Check logs
docker-compose logs [service-name]

# Restart the service
docker-compose restart [service-name]
```

### If Eureka shows no services:
```bash
# Wait 60 seconds for registration
# Then check logs
docker-compose logs -f eureka-server
```

### If API calls fail:
1. Check if port 8080 is forwarded in Codespaces
2. Verify the token is included in Authorization header
3. Check API Gateway logs: `docker-compose logs -f api-gateway`

---

## 🎊 Success Criteria

You'll know everything is working when:

1. ✅ Eureka Dashboard shows 7 registered services
2. ✅ You can register a user
3. ✅ You can login and get a JWT token
4. ✅ You can create products (with auth)
5. ✅ You can create orders (with auth)
6. ✅ Order creation logs show:
   - Product fetched
   - Inventory reserved
   - Payment processed
   - Notification sent

---

## 📚 Next Steps

Once everything is working:

1. **Test More Endpoints** - See `POSTMAN_COLLECTION.md` for full API documentation
2. **Monitor with Prometheus** - Start Prometheus and Grafana services
3. **Load Testing** - Test with multiple concurrent requests
4. **Add More Data** - Create multiple users, products, and orders
5. **Test Failure Scenarios** - Stop a service and see circuit breakers in action

---

## 🚀 Quick Commands Reference

```bash
# Start all services
./start-microservices.sh

# Check status
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🎉 Congratulations!

You now have a fully functional E-Commerce Microservices Platform running in GitHub Codespaces! 

This project demonstrates:
- ✅ Microservices Architecture
- ✅ Service Discovery (Eureka)
- ✅ API Gateway
- ✅ JWT Authentication
- ✅ Inter-service Communication (Feign)
- ✅ Event-Driven Architecture (Kafka)
- ✅ Distributed Transactions (Saga Pattern)
- ✅ Caching (Redis)
- ✅ Search (Elasticsearch)
- ✅ Containerization (Docker)
- ✅ Cloud Deployment (GitHub Codespaces)

**Perfect for SDE interviews!** 🎯
