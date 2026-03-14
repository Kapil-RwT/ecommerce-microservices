# E-Commerce Microservices Platform

A **full-stack** e-commerce platform built with **Spring Boot 3** microservices (backend) and **React + TypeScript** (frontend) — designed to demonstrate key concepts for SDE interviews.

## Architecture

```
                       ┌─────────────────┐
                       │  React Frontend │ :5173
                       │ (Vite + TS +    │
                       │  Tailwind CSS)  │
                       └────────┬────────┘
                                │ /api proxy
                       ┌────────┴────────┐
                       │   API Gateway   │ :8080
                       │ (Spring Cloud   │
                       │    Gateway)     │
                       └────────┬────────┘
                                │
                       ┌────────┴────────┐
                       │  Eureka Server  │ :8761
                       │   (Discovery)   │
                       └────────┬────────┘
              ┌────────┬────────┼────────┬────────┬────────┐
              │        │        │        │        │        │
         ┌────┴──┐┌────┴──┐┌───┴──┐┌────┴──┐┌───┴───┐┌───┴────┐
         │ User  ││Product││Order ││Pay-   ││Inven- ││Notif-  │
         │Service││Service││Svc   ││ment   ││tory   ││ication │
         │ :8081 ││ :8082 ││:8085 ││:8084  ││:8083  ││:8086   │
         └───┬───┘└───┬───┘└──┬───┘└───┬───┘└───┬───┘└───┬────┘
             │        │       │        │        │        │
        PostgreSQL PostgreSQL PostgreSQL PostgreSQL PostgreSQL Kafka
        + Cache   + Cache   + Kafka   + Kafka  + Kafka
                  + Elastic
```

## Key Concepts Covered

| Concept | Implementation |
|---------|---------------|
| **Microservices** | 6 independent services + gateway + discovery |
| **Full-Stack** | React + TypeScript frontend with Tailwind CSS |
| **API Gateway** | Spring Cloud Gateway (reactive, route-based) |
| **Service Discovery** | Netflix Eureka Server |
| **Inter-service Comm** | OpenFeign declarative REST clients |
| **Async Messaging** | Apache Kafka (order events, notifications) |
| **Distributed Transactions** | Saga pattern (OrderSaga orchestrator) |
| **Circuit Breaker** | Resilience4j (fallbacks, retry) |
| **Security** | JWT authentication at gateway level |
| **Databases** | PostgreSQL per service (database-per-service pattern) |
| **Caching** | Spring Cache (Redis-ready, in-memory default) |
| **Search** | Elasticsearch (optional, for product search) |
| **Monitoring** | Prometheus + Grafana + Spring Actuator |
| **Containerization** | Docker + Docker Compose |
| **API Docs** | SpringDoc OpenAPI / Swagger UI |
| **State Management** | Zustand (lightweight, fast) |
| **Validation** | Jakarta Bean Validation |
| **Global Exception Handling** | `@ControllerAdvice` with custom exceptions |
| **Object Mapping** | MapStruct + Lombok |

## Quick Start (GitHub Codespaces) — Recommended

### 1. Start Backend
```bash
chmod +x rebuild-all.sh
./rebuild-all.sh
```
Wait ~5 min for all services to start. Check Eureka: open **Ports** tab → globe icon on port **8761**.

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **Ports** tab → globe icon on port **5173** to view the app.

## Frontend Features

| Feature | Description |
|---------|-------------|
| **Home** | Hero section, categories, feature highlights |
| **Products** | Browse, search, filter by category, pagination |
| **Product Detail** | Full details, quantity selector, add to cart |
| **Shopping Cart** | Add/remove items, update quantities, persists in localStorage |
| **Checkout** | Shipping address, payment method, order summary |
| **Orders** | Order history with status tracking |
| **Auth** | Register, login with JWT, protected routes |
| **Responsive** | Mobile-first, works on all screen sizes |

## Frontend Tech Stack

- **React 18** — UI library
- **Vite** — Build tool (fast HMR)
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **Zustand** — State management (auth + cart)
- **Axios** — HTTP client with interceptors
- **Lucide React** — Icons
- **React Hot Toast** — Notifications

## API Endpoints (via Gateway on port 8080)

### User Service
```bash
# Register
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"Pass1234!","firstName":"John","lastName":"Doe","role":"USER"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"john","password":"Pass1234!"}'
```

### Product Service
```bash
# Create product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15","description":"Latest iPhone","sku":"IPHONE-15","price":999.99,"category":"Electronics","brand":"Apple","active":true,"featured":true}'

# List products
curl http://localhost:8080/api/products

# Search
curl "http://localhost:8080/api/products/search?keyword=iPhone"
```

### Inventory Service
```bash
# Add inventory
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":100,"warehouseLocation":"WH-001","reorderLevel":10}'

# Check stock
curl http://localhost:8080/api/inventory/product/1
```

### Order Service
```bash
# Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}],"shippingAddress":"123 Main St","paymentMethod":"CREDIT_CARD"}'

# Get orders by user
curl http://localhost:8080/api/orders/user/1
```

## Project Structure

```
ecommerce-microservices/
├── frontend/               # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── api/            # Axios API layer
│   │   ├── components/     # Shared components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores (auth, cart)
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Router
│   │   └── main.tsx        # Entry point
│   └── package.json
├── common-lib/             # Shared DTOs, exceptions, JWT utility
├── eureka-server/          # Service discovery (port 8761)
├── api-gateway/            # API Gateway with JWT auth (port 8080)
├── user-service/           # User registration & auth (port 8081)
├── product-service/        # Product catalog (port 8082)
├── inventory-service/      # Stock management (port 8083)
├── payment-service/        # Payment processing (port 8084)
├── order-service/          # Orders + Saga pattern (port 8085)
├── notification-service/   # Kafka event consumer (port 8086)
├── monitoring/             # Prometheus config
├── docker-compose.yml      # Full stack orchestration
└── rebuild-all.sh          # One-command build & deploy
```

## Monitoring

- **Eureka Dashboard**: http://localhost:8761
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Swagger UI** (per service): http://localhost:{port}/swagger-ui.html

## Tech Stack

**Backend**: Java 17, Spring Boot 3.2, Spring Cloud 2023.0, PostgreSQL 15, Redis 7, Elasticsearch 8.11, Apache Kafka, Docker, Lombok, MapStruct, JJWT, Resilience4j

**Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, React Router 6, Zustand, Axios, Lucide React
