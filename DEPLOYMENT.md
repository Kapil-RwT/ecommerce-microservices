# Deployment Guide

## Local Development Deployment

### Prerequisites
- Docker Desktop installed and running
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-microservices

# Make scripts executable
chmod +x build-all.sh start-services.sh

# Build and start all services
./start-services.sh
```

This will:
1. Build all microservices
2. Create Docker images
3. Start all infrastructure (PostgreSQL, Redis, Kafka, Elasticsearch)
4. Start all microservices
5. Display service URLs

### Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Check service health
curl http://localhost:8761  # Eureka Dashboard
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8081/actuator/health  # User Service
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## AWS Deployment

### Option 1: AWS ECS (Elastic Container Service)

#### Prerequisites
- AWS CLI installed and configured
- Docker images pushed to ECR

#### Steps

1. **Create ECR Repositories**

```bash
# Create repositories for each service
aws ecr create-repository --repository-name ecommerce-eureka-server
aws ecr create-repository --repository-name ecommerce-api-gateway
aws ecr create-repository --repository-name ecommerce-user-service
aws ecr create-repository --repository-name ecommerce-product-service
aws ecr create-repository --repository-name ecommerce-inventory-service
aws ecr create-repository --repository-name ecommerce-payment-service
aws ecr create-repository --repository-name ecommerce-order-service
aws ecr create-repository --repository-name ecommerce-notification-service
```

2. **Build and Push Images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push each service
./build-all.sh

services=("eureka-server" "api-gateway" "user-service" "product-service" "inventory-service" "payment-service" "order-service" "notification-service")

for service in "${services[@]}"
do
    docker tag ecommerce-$service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-$service:latest
    docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-$service:latest
done
```

3. **Create RDS Instances**

```bash
# Create PostgreSQL instances for each service
aws rds create-db-instance \
    --db-instance-identifier ecommerce-users-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgres \
    --master-user-password <your-password> \
    --allocated-storage 20

# Repeat for other databases
```

4. **Create ElastiCache Redis Cluster**

```bash
aws elasticache create-cache-cluster \
    --cache-cluster-id ecommerce-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1
```

5. **Create MSK (Managed Kafka) Cluster**

```bash
aws kafka create-cluster \
    --cluster-name ecommerce-kafka \
    --broker-node-group-info file://broker-info.json \
    --kafka-version 2.8.1
```

6. **Create ECS Cluster**

```bash
aws ecs create-cluster --cluster-name ecommerce-cluster
```

7. **Create Task Definitions and Services**

Create task definitions for each service and deploy them to ECS.

### Option 2: AWS EKS (Kubernetes)

#### Prerequisites
- kubectl installed
- eksctl installed
- AWS CLI configured

#### Steps

1. **Create EKS Cluster**

```bash
eksctl create cluster \
    --name ecommerce-cluster \
    --region us-east-1 \
    --nodegroup-name standard-workers \
    --node-type t3.medium \
    --nodes 3 \
    --nodes-min 1 \
    --nodes-max 4
```

2. **Create Kubernetes Manifests**

Create deployment and service manifests for each microservice:

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-user-service:latest
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_DATASOURCE_URL
          value: jdbc:postgresql://<rds-endpoint>:5432/ecommerce_users
        - name: SPRING_DATASOURCE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 8081
    targetPort: 8081
  type: LoadBalancer
```

3. **Deploy to Kubernetes**

```bash
# Create namespace
kubectl create namespace ecommerce

# Create secrets
kubectl create secret generic db-credentials \
    --from-literal=username=postgres \
    --from-literal=password=<your-password> \
    -n ecommerce

# Deploy services
kubectl apply -f k8s/ -n ecommerce

# Check deployment
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
```

4. **Setup Ingress**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
spec:
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 8080
```

## Azure Deployment

### Azure Kubernetes Service (AKS)

```bash
# Create resource group
az group create --name ecommerce-rg --location eastus

# Create AKS cluster
az aks create \
    --resource-group ecommerce-rg \
    --name ecommerce-cluster \
    --node-count 3 \
    --enable-addons monitoring \
    --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group ecommerce-rg --name ecommerce-cluster

# Deploy services
kubectl apply -f k8s/
```

### Azure Container Instances

```bash
# Create container registry
az acr create --resource-group ecommerce-rg --name ecommerceacr --sku Basic

# Push images
az acr login --name ecommerceacr
docker tag user-service ecommerceacr.azurecr.io/user-service:latest
docker push ecommerceacr.azurecr.io/user-service:latest

# Create container instances
az container create \
    --resource-group ecommerce-rg \
    --name user-service \
    --image ecommerceacr.azurecr.io/user-service:latest \
    --cpu 1 \
    --memory 1 \
    --registry-login-server ecommerceacr.azurecr.io \
    --ports 8081
```

## Google Cloud Platform (GCP)

### Google Kubernetes Engine (GKE)

```bash
# Create cluster
gcloud container clusters create ecommerce-cluster \
    --num-nodes=3 \
    --zone=us-central1-a

# Get credentials
gcloud container clusters get-credentials ecommerce-cluster --zone=us-central1-a

# Deploy services
kubectl apply -f k8s/
```

## Production Checklist

### Before Deployment

- [ ] Update all passwords and secrets
- [ ] Configure proper database backups
- [ ] Setup SSL/TLS certificates
- [ ] Configure monitoring and alerting
- [ ] Setup log aggregation
- [ ] Configure autoscaling policies
- [ ] Review security groups/firewall rules
- [ ] Setup CI/CD pipeline
- [ ] Configure domain and DNS
- [ ] Test disaster recovery procedures

### Security

- [ ] Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Enable encryption at rest for databases
- [ ] Enable encryption in transit (SSL/TLS)
- [ ] Configure VPC/VNet properly
- [ ] Setup WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Configure security scanning
- [ ] Setup audit logging

### Monitoring

- [ ] Configure Prometheus for metrics
- [ ] Setup Grafana dashboards
- [ ] Configure alerting rules
- [ ] Setup distributed tracing (Jaeger/Zipkin)
- [ ] Configure log aggregation (ELK Stack)
- [ ] Setup uptime monitoring
- [ ] Configure APM (Application Performance Monitoring)

### Scalability

- [ ] Configure horizontal pod autoscaling
- [ ] Setup database read replicas
- [ ] Configure CDN for static assets
- [ ] Setup caching layer (Redis)
- [ ] Configure load balancing
- [ ] Setup message queue scaling

### Backup & Recovery

- [ ] Configure automated database backups
- [ ] Test restore procedures
- [ ] Setup disaster recovery plan
- [ ] Configure multi-region deployment
- [ ] Setup data replication

## Cost Optimization

### AWS Cost Optimization

1. **Use Reserved Instances** for predictable workloads
2. **Enable Auto Scaling** to scale down during low traffic
3. **Use Spot Instances** for non-critical services
4. **Configure S3 Lifecycle Policies** for logs
5. **Use CloudWatch Alarms** to monitor costs

### Azure Cost Optimization

1. **Use Azure Reserved VM Instances**
2. **Enable Autoscaling**
3. **Use Azure Spot VMs**
4. **Configure storage tiers**
5. **Use Azure Cost Management**

### GCP Cost Optimization

1. **Use Committed Use Discounts**
2. **Enable Autoscaling**
3. **Use Preemptible VMs**
4. **Configure storage classes**
5. **Use Cloud Billing reports**

## Troubleshooting

### Common Issues

1. **Services not connecting**
   - Check security groups/firewall rules
   - Verify service discovery is working
   - Check network connectivity

2. **Database connection issues**
   - Verify connection strings
   - Check database security groups
   - Verify credentials

3. **High latency**
   - Check resource utilization
   - Review database query performance
   - Check network latency
   - Review caching strategy

4. **Memory issues**
   - Increase container memory limits
   - Review JVM heap settings
   - Check for memory leaks

## Rollback Procedures

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/user-service -n ecommerce

# Rollback to previous version
kubectl rollout undo deployment/user-service -n ecommerce

# Rollback to specific revision
kubectl rollout undo deployment/user-service --to-revision=2 -n ecommerce
```

### ECS Rollback

```bash
# Update service to previous task definition
aws ecs update-service \
    --cluster ecommerce-cluster \
    --service user-service \
    --task-definition user-service:1
```

## Support

For deployment issues:
1. Check service logs
2. Review health check endpoints
3. Verify environment variables
4. Check resource limits
5. Review security configurations

For additional help, refer to:
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [GCP Documentation](https://cloud.google.com/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
