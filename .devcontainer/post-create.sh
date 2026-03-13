#!/bin/bash

echo "🚀 Setting up E-Commerce Microservices Platform..."
echo "=================================================="

# Set Java 17
export JAVA_HOME=/usr/local/sdkman/candidates/java/current
export PATH="$JAVA_HOME/bin:$PATH"

# Verify installations
echo "✅ Java version:"
java -version

echo ""
echo "✅ Maven version:"
mvn -version

echo ""
echo "✅ Docker version:"
docker --version

echo ""
echo "✅ Docker Compose version:"
docker-compose --version

echo ""
echo "=================================================="
echo "🎉 Environment is ready!"
echo "=================================================="
echo ""
echo "To start all services, run:"
echo "  ./start-services.sh"
echo ""
echo "Or to build and start:"
echo "  ./build-all.sh && docker-compose up -d"
echo ""
echo "Happy coding! 🚀"
