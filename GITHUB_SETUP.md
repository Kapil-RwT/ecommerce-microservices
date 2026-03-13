# 🚀 Complete GitHub & Codespaces Setup Guide

Follow these steps to get your E-Commerce Microservices Platform running on GitHub Codespaces.

## Step 1: Initialize Git Repository

```bash
cd /Users/kapil.rawat/Documents/Personal/ecommerce-microservices

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: E-Commerce Microservices Platform with Spring Boot

- 8 microservices (User, Product, Order, Payment, Inventory, Notification, API Gateway, Eureka)
- Service Discovery with Eureka
- API Gateway with Spring Cloud Gateway
- JWT Authentication & Security
- Distributed transactions with Saga pattern
- Event-driven architecture with Kafka
- Circuit breaker with Resilience4j
- Caching with Redis
- Product search with Elasticsearch
- Monitoring with Prometheus & Grafana
- Docker & Docker Compose setup
- Complete CI/CD pipeline"
```

## Step 2: Create GitHub Repository

### Option A: Via GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not installed
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create ecommerce-microservices --public --source=. --remote=origin --push

# Done! Your code is now on GitHub
```

### Option B: Via GitHub Website

1. Go to https://github.com/new
2. Repository name: `ecommerce-microservices`
3. Description: "Production-ready E-Commerce Microservices Platform with Spring Boot"
4. Choose Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

Then push your code:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-microservices.git

# Push
git branch -M main
git push -u origin main
```

## Step 3: Open in GitHub Codespaces

1. Go to your repository on GitHub
2. Click the green **"<> Code"** button
3. Click on the **"Codespaces"** tab
4. Click **"Create codespace on main"**

![Codespaces Button](https://docs.github.com/assets/cb-138303/mw-1440/images/help/codespaces/new-codespace-button.webp)

**Wait 2-3 minutes** while GitHub:
- Creates a cloud VM
- Installs Java 17
- Installs Maven
- Installs Docker
- Sets up VS Code in the browser

## Step 4: Start the Application

Once your Codespace opens, you'll see VS Code in your browser. Open the terminal (Ctrl + ` or Cmd + `) and run:

```bash
# Build all services
./build-all.sh
```

This will take 3-5 minutes the first time. Then:

```bash
# Start all services with Docker Compose
docker-compose up -d
```

Wait 2-3 minutes for all services to start.

## Step 5: Access Your Services

GitHub will automatically forward ports. Look for notifications in the bottom-right corner, or:

1. Click on the **"PORTS"** tab in the bottom panel
2. You'll see all forwarded ports with URLs like:
   - `https://legendary-space-engine-xxxxx-8080.app.github.dev` (API Gateway)
   - `https://legendary-space-engine-xxxxx-8761.app.github.dev` (Eureka)

Click on the globe icon 🌐 next to port 8761 to open Eureka Dashboard.

## Step 6: Test the APIs

### Get Your API Gateway URL

In the PORTS tab, find port 8080 and copy the URL. Let's call it `YOUR_GATEWAY_URL`.

### Test Health Check

```bash
curl https://YOUR_GATEWAY_URL/actuator/health
```

### Register a User

```bash
curl -X POST https://YOUR_GATEWAY_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User",
    "phoneNumber": "+1234567890"
  }'
```

### Login

```bash
curl -X POST https://YOUR_GATEWAY_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

Copy the JWT token from the response.

### Create a Product

```bash
curl -X POST https://YOUR_GATEWAY_URL/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "MacBook Pro",
    "description": "16-inch laptop",
    "sku": "MBP-16-2024",
    "price": 2499.99,
    "category": "Electronics",
    "brand": "Apple",
    "active": true
  }'
```

## 🎉 Success!

Your microservices platform is now running in the cloud! You can:

- ✅ Access it from anywhere
- ✅ Share URLs with others
- ✅ Make changes and see them live
- ✅ Use it for demos and interviews

## 📊 Monitoring Dashboards

### Eureka Service Registry
- Port: 8761
- See all registered microservices

### Prometheus Metrics
- Port: 9090
- Query and visualize metrics

### Grafana Dashboards
- Port: 3000
- Username: `admin`
- Password: `admin`

## 🔧 Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
docker-compose logs -f order-service
```

### Check Running Services
```bash
docker-compose ps
```

### Restart a Service
```bash
docker-compose restart user-service
```

### Stop Everything
```bash
docker-compose down
```

### Rebuild After Changes
```bash
# Rebuild specific service
mvn clean package -DskipTests -pl user-service
docker-compose build user-service
docker-compose up -d user-service

# Or rebuild everything
./build-all.sh
docker-compose up -d --build
```

## 💰 Codespaces Free Tier

GitHub provides:
- **60 hours/month** of Codespaces usage (free)
- **15 GB/month** of storage (free)

Perfect for development and demos!

## 🎓 For Interviews

When showing this project:

1. **Open Eureka Dashboard** - Show service discovery
2. **Open Grafana** - Show monitoring dashboards
3. **Demo API calls** - Show the complete order flow
4. **Show Docker Compose** - Explain the architecture
5. **Show code** - Walk through Saga pattern, Circuit breaker, etc.

## 🐛 Troubleshooting

### Codespace Won't Start?
- Try deleting and recreating the Codespace
- Check your GitHub billing page for quota

### Services Not Starting?
```bash
# Check Docker
docker ps

# Check logs
docker-compose logs

# Restart
docker-compose down
docker-compose up -d
```

### Port Not Forwarding?
- Go to PORTS tab
- Right-click on port → "Port Visibility" → "Public"

### Out of Memory?
Free Codespaces have 4GB RAM. Start only essential services:
```bash
docker-compose up -d postgres-users postgres-products postgres-orders redis kafka zookeeper eureka-server api-gateway user-service product-service order-service
```

## 📚 Next Steps

1. ✅ Set up GitHub repository
2. ✅ Open in Codespaces
3. ✅ Start services
4. ✅ Test APIs
5. 📝 Add more features
6. 🚀 Show in interviews

## 🌟 Making it Public

To share your running application:

1. Go to PORTS tab
2. Right-click on port 8080
3. Select "Port Visibility" → "Public"
4. Share the URL!

---

**You're all set! 🎉**

Your production-ready microservices platform is now running in the cloud, ready for development, testing, and showcasing in interviews!
