# 🧪 Complete Testing Guide

This guide provides step-by-step instructions to test all features of the E-Commerce Microservices Platform.

## Prerequisites

- Services running (via `docker-compose up -d`)
- Access to API Gateway URL (in Codespaces: check PORTS tab for port 8080)

## Environment Variables

```bash
# Set your API Gateway URL
export API_URL="https://your-codespace-url-8080.app.github.dev"

# Or for local testing
export API_URL="http://localhost:8080"
```

## Test Flow: Complete E-Commerce Journey

### 1. Health Check ✅

```bash
curl $API_URL/actuator/health
```

Expected: `{"status":"UP"}`

### 2. Register Users 👤

#### Register Customer
```bash
curl -X POST $API_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_customer",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "fullName": "John Customer",
    "phoneNumber": "+1234567890"
  }'
```

#### Register Admin
```bash
curl -X POST $API_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "fullName": "Admin User",
    "phoneNumber": "+1234567891"
  }'
```

### 3. Login 🔐

#### Customer Login
```bash
CUSTOMER_TOKEN=$(curl -X POST $API_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_customer",
    "password": "SecurePass123!"
  }' | jq -r '.data.token')

echo "Customer Token: $CUSTOMER_TOKEN"
```

#### Admin Login
```bash
ADMIN_TOKEN=$(curl -X POST $API_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "AdminPass123!"
  }' | jq -r '.data.token')

echo "Admin Token: $ADMIN_TOKEN"
```

### 4. Create Products 📦

#### Product 1: Laptop
```bash
curl -X POST $API_URL/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "MacBook Pro 16-inch",
    "description": "Apple M3 Max, 36GB RAM, 1TB SSD",
    "sku": "MBP-16-M3-2024",
    "price": 3499.99,
    "discountPrice": 3299.99,
    "category": "Electronics",
    "brand": "Apple",
    "imageUrl": "https://example.com/macbook.jpg",
    "active": true,
    "featured": true,
    "color": "Space Gray",
    "weight": 2.1,
    "dimensions": "35.79 x 24.81 x 1.68 cm"
  }'
```

#### Product 2: Headphones
```bash
curl -X POST $API_URL/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Sony WH-1000XM5",
    "description": "Premium noise-cancelling wireless headphones",
    "sku": "SONY-WH-1000XM5",
    "price": 399.99,
    "category": "Electronics",
    "brand": "Sony",
    "active": true,
    "featured": true,
    "color": "Black"
  }'
```

#### Product 3: Phone
```bash
curl -X POST $API_URL/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "description": "256GB, Titanium Blue",
    "sku": "IPHONE-15-PRO-MAX-256",
    "price": 1199.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true,
    "featured": true,
    "color": "Titanium Blue",
    "size": "256GB"
  }'
```

### 5. View Products 👀

#### Get All Products
```bash
curl $API_URL/api/products \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

#### Get Product by ID
```bash
curl $API_URL/api/products/1 \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

#### Search Products
```bash
curl "$API_URL/api/products/search?keyword=MacBook" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### 6. Add Inventory 📊

```bash
# Add inventory for Product 1 (MacBook)
curl -X POST $API_URL/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 50,
    "reservedQuantity": 0
  }'

# Add inventory for Product 2 (Headphones)
curl -X POST $API_URL/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "productId": 2,
    "quantity": 100,
    "reservedQuantity": 0
  }'

# Add inventory for Product 3 (iPhone)
curl -X POST $API_URL/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "productId": 3,
    "quantity": 75,
    "reservedQuantity": 0
  }'
```

### 7. Check Stock 🔍

```bash
curl "$API_URL/api/inventory/check?productId=1&quantity=2" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### 8. Create Order 🛒

```bash
curl -X POST $API_URL/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001, USA",
    "paymentMethod": "CREDIT_CARD"
  }'
```

### 9. View Orders 📋

#### Get User Orders
```bash
curl $API_URL/api/orders/user/1 \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

#### Get Order by ID
```bash
curl $API_URL/api/orders/1 \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### 10. Process Payment 💳

```bash
curl -X POST $API_URL/api/payments/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "orderId": 1,
    "userId": 1,
    "amount": 4099.97,
    "paymentMethod": "CREDIT_CARD"
  }'
```

### 11. Update Inventory 📦

```bash
curl -X PUT $API_URL/api/inventory/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "quantity": 45,
    "reservedQuantity": 5
  }'
```

## Advanced Testing Scenarios

### Test 1: Circuit Breaker (Resilience)

Stop the inventory service:
```bash
docker-compose stop inventory-service
```

Try to create an order (should fail gracefully):
```bash
curl -X POST $API_URL/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "items": [{"productId": 1, "quantity": 1}],
    "shippingAddress": "Test Address",
    "paymentMethod": "CREDIT_CARD"
  }'
```

Restart the service:
```bash
docker-compose start inventory-service
```

### Test 2: Saga Pattern (Distributed Transaction)

Create an order with insufficient stock:
```bash
curl -X POST $API_URL/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1000
      }
    ],
    "shippingAddress": "Test Address",
    "paymentMethod": "CREDIT_CARD"
  }'
```

Should return error and NOT create order.

### Test 3: Rate Limiting

Send multiple rapid requests:
```bash
for i in {1..20}; do
  curl $API_URL/api/products -H "Authorization: Bearer $CUSTOMER_TOKEN"
done
```

After threshold, should get 429 Too Many Requests.

### Test 4: Caching (Redis)

First request (cache miss):
```bash
time curl $API_URL/api/products/1 -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Second request (cache hit - should be faster):
```bash
time curl $API_URL/api/products/1 -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### Test 5: Event-Driven (Kafka)

Create an order and check notification service logs:
```bash
docker-compose logs -f notification-service
```

You should see payment and order events being processed.

## Monitoring & Observability

### View Eureka Dashboard
```
https://your-codespace-url-8761.app.github.dev
```

All services should be registered.

### View Prometheus Metrics
```
https://your-codespace-url-9090.app.github.dev
```

Query: `http_server_requests_seconds_count`

### View Grafana Dashboards
```
https://your-codespace-url-3000.app.github.dev
```
- Username: `admin`
- Password: `admin`

## Performance Testing

### Load Test with Apache Bench

```bash
# Install ab (Apache Bench)
apt-get install apache2-utils

# Test product listing
ab -n 1000 -c 10 -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  $API_URL/api/products
```

### Load Test with wrk

```bash
# Install wrk
apt-get install wrk

# Test with wrk
wrk -t4 -c100 -d30s -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  $API_URL/api/products
```

## Database Verification

### Check PostgreSQL

```bash
# Connect to user database
docker-compose exec postgres-users psql -U postgres -d ecommerce_users

# List users
SELECT id, username, email, full_name FROM users;

# Exit
\q
```

### Check Redis Cache

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# List all keys
KEYS *

# Get a cached product
GET "product:1"

# Exit
exit
```

### Check Elasticsearch

```bash
# Search products
curl "$API_URL:9200/products/_search?q=MacBook"
```

## Troubleshooting Tests

### If tests fail:

1. **Check service health:**
```bash
docker-compose ps
```

2. **Check logs:**
```bash
docker-compose logs -f [service-name]
```

3. **Restart service:**
```bash
docker-compose restart [service-name]
```

4. **Full reset:**
```bash
docker-compose down -v
docker-compose up -d
```

## Test Checklist ✅

- [ ] Health checks pass
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Products can be created
- [ ] Products can be listed
- [ ] Product search works
- [ ] Inventory can be added
- [ ] Stock checks work
- [ ] Orders can be created
- [ ] Payments can be processed
- [ ] Saga pattern handles failures
- [ ] Circuit breaker activates
- [ ] Rate limiting works
- [ ] Caching improves performance
- [ ] Events are published to Kafka
- [ ] All services registered in Eureka
- [ ] Metrics visible in Prometheus
- [ ] Dashboards work in Grafana

## Interview Demo Script

For interviews, follow this flow:

1. **Show Architecture** - Open Eureka Dashboard
2. **User Journey** - Register → Login → Browse Products
3. **Create Order** - Full order flow with Saga pattern
4. **Show Monitoring** - Grafana dashboards
5. **Demonstrate Resilience** - Stop a service, show circuit breaker
6. **Explain Code** - Walk through key patterns

---

**Happy Testing! 🚀**
