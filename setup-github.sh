#!/bin/bash

echo "🚀 GitHub Setup Helper"
echo "======================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Name: ecommerce-microservices"
echo "   (Don't initialize with README)"
echo ""
echo "2. Then run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'feat: E-Commerce Microservices Platform'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ecommerce-microservices.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Open in Codespaces:"
echo "   - Go to your repository on GitHub"
echo "   - Click 'Code' → 'Codespaces' → 'Create codespace'"
echo ""
echo "4. In Codespaces terminal, run:"
echo "   ./build-all.sh && docker-compose up -d"
echo ""
echo "======================"
echo "📚 Full guide: GITHUB_SETUP.md"
echo "======================"
