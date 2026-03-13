# Architecture Documentation

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          API Gateway                             │
│              (Routing, Auth, Rate Limiting)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Discovery                           │
│                      (Eureka Server)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ User Service │    │Product Service│   │ Order Service│
│              │    │              │    │   (Saga)     │
│  PostgreSQL  │    │  PostgreSQL  │    │  PostgreSQL  │
└──────────────┘    │ Elasticsearch │    └──────────────┘
                    │    Redis     │           │
                    └──────────────┘           │
                                               ▼
                    ┌──────────────┐    ┌──────────────┐
                    │   Inventory  │    │   Payment    │
                    │   Service    │    │   Service    │
                    │  PostgreSQL  │    │  PostgreSQL  │
                    └──────────────┘    └──────────────┘
                            │                   │
                            └────────┬──────────┘
                                     ▼
                            ┌──────────────┐
                            │    Kafka     │
                            └──────────────┘
                                     │
                                     ▼
                            ┌──────────────┐
                            │ Notification │
                            │   Service    │
                            └──────────────┘
```

## Service Responsibilities

### 1. API Gateway
**Port**: 8080  
**Responsibilities**:
- Single entry point for all client requests
- Request routing to appropriate microservices
- JWT token validation
- Rate limiting (100 requests/minute per IP)
- Circuit breaker for downstream services
- Load balancing

**Key Technologies**:
- Spring Cloud Gateway
- Resilience4j Circuit Breaker
- Redis for rate limiting

### 2. Eureka Server
**Port**: 8761  
**Responsibilities**:
- Service registration and discovery
- Health checking
- Load balancing information

### 3. User Service
**Port**: 8081  
**Database**: PostgreSQL (ecommerce_users)  
**Responsibilities**:
- User registration and authentication
- JWT token generation
- User profile management
- Role-based access control

**Key Features**:
- BCrypt password hashing
- JWT token with 24-hour expiration
- Redis caching for user data

### 4. Product Service
**Port**: 8082  
**Database**: PostgreSQL (ecommerce_products)  
**Search Engine**: Elasticsearch  
**Responsibilities**:
- Product catalog management
- Product search and filtering
- Category management
- Featured products

**Key Features**:
- Elasticsearch for full-text search
- Redis caching for frequently accessed products
- Automatic indexing to Elasticsearch
- Pagination support

### 5. Inventory Service
**Port**: 8083  
**Database**: PostgreSQL (ecommerce_inventory)  
**Responsibilities**:
- Stock level management
- Inventory reservation
- Stock confirmation/release
- Low stock alerts

**Key Features**:
- Pessimistic locking for concurrent updates
- Version-based optimistic locking
- Kafka events for inventory changes

### 6. Payment Service
**Port**: 8084  
**Database**: PostgreSQL (ecommerce_payments)  
**Responsibilities**:
- Payment processing
- Payment gateway integration
- Refund processing
- Payment history

**Key Features**:
- Simulated payment gateway
- Kafka events for payment status
- Transaction tracking

### 7. Order Service
**Port**: 8085  
**Database**: PostgreSQL (ecommerce_orders)  
**Responsibilities**:
- Order creation and management
- Saga orchestration
- Order status tracking
- Order history

**Key Features**:
- **Saga Pattern Implementation**
- Feign clients for inter-service communication
- Circuit breaker for resilience
- Kafka events for order updates

### 8. Notification Service
**Port**: 8086  
**Responsibilities**:
- Async notification processing
- Email notifications (simulated)
- SMS notifications (simulated)
- Push notifications (simulated)

**Key Features**:
- Kafka consumer for events
- Async processing

## Saga Pattern Implementation

### Order Creation Flow

```
┌──────────────┐
│ Create Order │
│   (PENDING)  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Reserve Inventory│ ──┐
└──────┬───────────┘   │
       │                │ Failure
       │ Success        │
       ▼                ▼
┌──────────────┐  ┌─────────────┐
│Process Payment│  │Compensate   │
└──────┬────────┘  │(Release     │
       │           │ Inventory)  │
       │ Success   └─────────────┘
       ▼
┌──────────────────┐
│Confirm Inventory │
└──────┬───────────┘
       │
       ▼
┌──────────────┐
│Order CONFIRMED│
└───────────────┘
```

### Compensation Logic

If any step fails:
1. **Payment Fails**: Release reserved inventory
2. **Inventory Confirmation Fails**: Refund payment, release inventory
3. **Service Unavailable**: Circuit breaker triggers, order cancelled

## Data Flow

### 1. User Registration Flow
```
Client → API Gateway → User Service → PostgreSQL
                    ↓
                  Redis (Cache)
                    ↓
                JWT Token → Client
```

### 2. Product Search Flow
```
Client → API Gateway → Product Service → Elasticsearch
                                      ↓
                                   PostgreSQL
                                      ↓
                                    Redis (Cache)
```

### 3. Order Creation Flow (Saga)
```
Client → API Gateway → Order Service
                          ↓
                    Product Service (Get Product Details)
                          ↓
                    Inventory Service (Reserve Stock)
                          ↓
                    Payment Service (Process Payment)
                          ↓
                    Inventory Service (Confirm Reservation)
                          ↓
                    Kafka (Order Event)
                          ↓
                    Notification Service (Send Email)
```

## Communication Patterns

### Synchronous Communication
- **REST APIs**: Service-to-service calls via Feign Client
- **Circuit Breaker**: Resilience4j for fault tolerance
- **Retry Logic**: Automatic retries with exponential backoff

### Asynchronous Communication
- **Kafka Topics**:
  - `payment-events`: Payment status updates
  - `order-events`: Order status updates
  - `inventory-events`: Stock level changes

## Security Architecture

### Authentication Flow
```
1. User Login → User Service
2. Validate Credentials
3. Generate JWT Token (24h expiration)
4. Return Token to Client
5. Client includes token in Authorization header
6. API Gateway validates token
7. Gateway forwards request with user info
```

### JWT Token Structure
```json
{
  "sub": "username",
  "userId": 1,
  "role": "CUSTOMER",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Caching Strategy

### Multi-Level Caching

1. **Application Level**
   - Spring Cache with Caffeine
   - Short TTL (5 minutes)

2. **Distributed Cache (Redis)**
   - User data: 1 hour TTL
   - Product data: 30 minutes TTL
   - Inventory data: 5 minutes TTL

3. **Cache Invalidation**
   - Write-through on updates
   - Event-driven invalidation via Kafka

## Database Design

### Database per Service Pattern

Each service has its own database to ensure:
- **Independence**: Services can be deployed independently
- **Scalability**: Each database can be scaled separately
- **Technology Flexibility**: Different databases for different needs
- **Fault Isolation**: Database failure affects only one service

### Consistency Patterns

1. **Strong Consistency**: Within a single service
2. **Eventual Consistency**: Across services via events
3. **Saga Pattern**: For distributed transactions

## Monitoring & Observability

### Metrics Collection
- **Spring Boot Actuator**: Health, metrics, info endpoints
- **Prometheus**: Metrics aggregation
- **Grafana**: Visualization

### Key Metrics
- Request rate and latency
- Error rates
- Circuit breaker status
- Database connection pool
- JVM metrics (heap, threads, GC)
- Kafka lag

### Health Checks
Each service exposes:
- `/actuator/health`: Overall health
- `/actuator/health/liveness`: Liveness probe
- `/actuator/health/readiness`: Readiness probe

## Scalability Considerations

### Horizontal Scaling
All services are stateless and can be scaled horizontally:
```bash
docker-compose up -d --scale order-service=3
```

### Load Balancing
- **Client-side**: Eureka + Ribbon
- **Server-side**: API Gateway

### Database Scaling
- **Read Replicas**: For read-heavy services
- **Sharding**: For large datasets
- **Connection Pooling**: HikariCP

## Resilience Patterns

### Circuit Breaker
```yaml
resilience4j:
  circuitbreaker:
    instances:
      orderSaga:
        sliding-window-size: 10
        failure-rate-threshold: 50%
        wait-duration-in-open-state: 10s
```

### Retry Logic
```yaml
resilience4j:
  retry:
    instances:
      orderSaga:
        max-attempts: 3
        wait-duration: 1s
```

### Timeouts
- **Connection Timeout**: 5 seconds
- **Read Timeout**: 5 seconds
- **Circuit Breaker Timeout**: 10 seconds

## Deployment Architecture

### Docker Compose (Development)
- All services in single host
- Shared network
- Volume mounts for data persistence

### Kubernetes (Production)
- Separate namespaces per environment
- Horizontal Pod Autoscaling
- Ingress for external access
- ConfigMaps and Secrets for configuration

### Cloud Deployment
- **AWS**: ECS/EKS with RDS, ElastiCache, MSK
- **Azure**: AKS with Azure Database, Redis Cache
- **GCP**: GKE with Cloud SQL, Memorystore

## Performance Optimization

### API Gateway
- Connection pooling
- Response caching
- Request compression

### Database
- Indexed columns
- Query optimization
- Connection pooling (HikariCP)

### Caching
- Redis for distributed cache
- Cache-aside pattern
- TTL-based expiration

### Async Processing
- Kafka for event-driven architecture
- CompletableFuture for parallel operations
- @Async for background tasks

## Future Enhancements

1. **API Versioning**: Support for multiple API versions
2. **GraphQL Gateway**: Alternative to REST
3. **Service Mesh**: Istio for advanced traffic management
4. **Distributed Tracing**: Zipkin/Jaeger
5. **Config Server**: Centralized configuration
6. **API Rate Limiting per User**: More granular control
7. **Real Payment Gateway**: Stripe/PayPal integration
8. **Email Service**: SendGrid/AWS SES integration
9. **File Storage**: AWS S3 for product images
10. **Advanced Search**: Elasticsearch with ML-based recommendations
