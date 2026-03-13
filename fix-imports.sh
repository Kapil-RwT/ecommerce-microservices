#!/bin/bash

echo "========================================="
echo "Fixing Import Issues in Order Service"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "order-service" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📝 Checking OrderSaga.java..."
grep -n "import.*PaymentRequestDto" order-service/src/main/java/com/ecommerce/order/saga/OrderSaga.java

echo ""
echo "📝 Checking OrderService.java..."
grep -n "import.*ProductDto" order-service/src/main/java/com/ecommerce/order/service/OrderService.java

echo ""
echo "📝 Checking if DTO files exist..."
if [ -f "order-service/src/main/java/com/ecommerce/order/client/dto/PaymentRequestDto.java" ]; then
    echo "✅ PaymentRequestDto.java exists"
else
    echo "❌ PaymentRequestDto.java NOT found"
fi

if [ -f "order-service/src/main/java/com/ecommerce/order/client/dto/ProductDto.java" ]; then
    echo "✅ ProductDto.java exists"
else
    echo "❌ ProductDto.java NOT found"
fi

if [ -f "order-service/src/main/java/com/ecommerce/order/client/dto/PaymentDto.java" ]; then
    echo "✅ PaymentDto.java exists"
else
    echo "❌ PaymentDto.java NOT found"
fi

echo ""
echo "========================================="
echo "If DTOs exist but imports are wrong, the issue is likely:"
echo "1. Old code still referencing com.ecommerce.order.client.PaymentRequestDto"
echo "2. Should be: com.ecommerce.order.client.dto.PaymentRequestDto"
echo "========================================="
