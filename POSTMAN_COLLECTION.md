# API Testing Guide - Postman Collection

## Setup

1. Import this collection into Postman
2. Set environment variables:
   - `base_url`: http://localhost:8080
   - `jwt_token`: (will be set automatically after login)

## Test Flow

### 1. User Registration

**POST** `{{base_url}}/api/users/register`

```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER"
}
```

**Expected Response**: 201 Created
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "type": "Bearer",
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "CUSTOMER"
        }
    }
}
```

### 2. User Login

**POST** `{{base_url}}/api/users/login`

```json
{
    "usernameOrEmail": "john_doe",
    "password": "password123"
}
```

**Post-response Script** (Save token):
```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data.token) {
    pm.environment.set("jwt_token", jsonData.data.token);
}
```

### 3. Create Products

**POST** `{{base_url}}/api/products`
**Headers**: `Authorization: Bearer {{jwt_token}}`

```json
{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 Pro chip",
    "sku": "IPH15PRO-256-BLK",
    "price": 999.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true,
    "featured": true
}
```

Create multiple products:

```json
{
    "name": "MacBook Pro M3",
    "description": "16-inch MacBook Pro with M3 Max",
    "sku": "MBP16-M3-1TB",
    "price": 2499.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true,
    "featured": true
}
```

```json
{
    "name": "AirPods Pro",
    "description": "Active Noise Cancellation",
    "sku": "AIRPODS-PRO-2",
    "price": 249.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true,
    "featured": false
}
```

### 4. Get All Products

**GET** `{{base_url}}/api/products?page=0&size=20&sortBy=id&sortDir=ASC`

### 5. Search Products

**GET** `{{base_url}}/api/products/search?keyword=iPhone&page=0&size=10`

### 6. Add Inventory

**POST** `{{base_url}}/api/inventory`
**Headers**: `Authorization: Bearer {{jwt_token}}`

```json
{
    "productId": 1,
    "quantity": 100,
    "reorderLevel": 10,
    "maxStockLevel": 500
}
```

Repeat for other products with different quantities.

### 7. Check Stock

**POST** `{{base_url}}/api/inventory/check`
**Headers**: `Authorization: Bearer {{jwt_token}}`

```json
{
    "productId": 1,
    "quantity": 2
}
```

### 8. Create Order (Saga Pattern)

**POST** `{{base_url}}/api/orders`
**Headers**: `Authorization: Bearer {{jwt_token}}`

```json
{
    "userId": 1,
    "items": [
        {
            "productId": 1,
            "quantity": 2
        },
        {
            "productId": 3,
            "quantity": 1
        }
    ],
    "shippingAddress": "123 Main St, San Francisco, CA 94102",
    "billingAddress": "123 Main St, San Francisco, CA 94102",
    "paymentMethod": "CREDIT_CARD"
}
```

**Expected Flow**:
1. Order created with status PENDING
2. Inventory reserved
3. Payment processed
4. Inventory confirmed
5. Order status changed to CONFIRMED

### 9. Get Order Details

**GET** `{{base_url}}/api/orders/{orderId}`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 10. Get User Orders

**GET** `{{base_url}}/api/orders/user/{userId}`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 11. Get Payment Details

**GET** `{{base_url}}/api/payments/order/{orderId}`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 12. Get Inventory Status

**GET** `{{base_url}}/api/inventory/product/{productId}`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 13. Get Low Stock Items

**GET** `{{base_url}}/api/inventory/low-stock`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 14. Update Order Status

**PUT** `{{base_url}}/api/orders/{orderId}/status?status=SHIPPED`
**Headers**: `Authorization: Bearer {{jwt_token}}`

### 15. Cancel Order

**POST** `{{base_url}}/api/orders/{orderId}/cancel?reason=Customer request`
**Headers**: `Authorization: Bearer {{jwt_token}}`

## Complete Postman Collection JSON

```json
{
    "info": {
        "name": "E-Commerce Microservices",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:8080"
        },
        {
            "key": "jwt_token",
            "value": ""
        }
    ],
    "item": [
        {
            "name": "User Management",
            "item": [
                {
                    "name": "Register User",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"john_doe\",\n    \"email\": \"john@example.com\",\n    \"password\": \"password123\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"phoneNumber\": \"+1234567890\",\n    \"role\": \"CUSTOMER\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/users/register",
                            "host": ["{{base_url}}"],
                            "path": ["api", "users", "register"]
                        }
                    }
                },
                {
                    "name": "Login",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "if (jsonData.data && jsonData.data.token) {",
                                    "    pm.environment.set(\"jwt_token\", jsonData.data.token);",
                                    "}"
                                ]
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"usernameOrEmail\": \"john_doe\",\n    \"password\": \"password123\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/users/login",
                            "host": ["{{base_url}}"],
                            "path": ["api", "users", "login"]
                        }
                    }
                }
            ]
        },
        {
            "name": "Product Management",
            "item": [
                {
                    "name": "Create Product",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            },
                            {
                                "key": "Authorization",
                                "value": "Bearer {{jwt_token}}"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"name\": \"iPhone 15 Pro\",\n    \"description\": \"Latest iPhone with A17 Pro chip\",\n    \"sku\": \"IPH15PRO-256-BLK\",\n    \"price\": 999.99,\n    \"category\": \"Electronics\",\n    \"brand\": \"Apple\",\n    \"active\": true,\n    \"featured\": true\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/products",
                            "host": ["{{base_url}}"],
                            "path": ["api", "products"]
                        }
                    }
                },
                {
                    "name": "Get All Products",
                    "request": {
                        "method": "GET",
                        "url": {
                            "raw": "{{base_url}}/api/products?page=0&size=20",
                            "host": ["{{base_url}}"],
                            "path": ["api", "products"],
                            "query": [
                                {"key": "page", "value": "0"},
                                {"key": "size", "value": "20"}
                            ]
                        }
                    }
                },
                {
                    "name": "Search Products",
                    "request": {
                        "method": "GET",
                        "url": {
                            "raw": "{{base_url}}/api/products/search?keyword=iPhone",
                            "host": ["{{base_url}}"],
                            "path": ["api", "products", "search"],
                            "query": [
                                {"key": "keyword", "value": "iPhone"}
                            ]
                        }
                    }
                }
            ]
        },
        {
            "name": "Order Management",
            "item": [
                {
                    "name": "Create Order",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            },
                            {
                                "key": "Authorization",
                                "value": "Bearer {{jwt_token}}"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"userId\": 1,\n    \"items\": [\n        {\n            \"productId\": 1,\n            \"quantity\": 2\n        }\n    ],\n    \"shippingAddress\": \"123 Main St, San Francisco, CA 94102\",\n    \"billingAddress\": \"123 Main St, San Francisco, CA 94102\",\n    \"paymentMethod\": \"CREDIT_CARD\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/orders",
                            "host": ["{{base_url}}"],
                            "path": ["api", "orders"]
                        }
                    }
                }
            ]
        }
    ]
}
```

## Testing Saga Pattern Failure Scenarios

### Test 1: Insufficient Stock

1. Create an order with quantity > available stock
2. Expected: Order should be cancelled, inventory released

### Test 2: Payment Failure

1. Modify payment service to simulate failure
2. Create an order
3. Expected: Order cancelled, inventory released

### Test 3: Service Timeout

1. Stop payment service
2. Create an order
3. Expected: Circuit breaker opens, order cancelled

## Performance Testing

Use Postman's Collection Runner or Newman for load testing:

```bash
newman run postman_collection.json -n 100 --delay-request 100
```

## Monitoring During Tests

1. Check Eureka Dashboard: http://localhost:8761
2. Check Prometheus: http://localhost:9090
3. Check Grafana: http://localhost:3000
4. Check service logs: `docker-compose logs -f order-service`
