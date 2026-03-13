package com.ecommerce.order.saga;

import com.ecommerce.order.client.InventoryClient;
import com.ecommerce.order.client.PaymentClient;
import com.ecommerce.order.client.dto.PaymentRequestDto;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderSaga {

    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    private final OrderRepository orderRepository;

    @Transactional
    @CircuitBreaker(name = "orderSaga", fallbackMethod = "orderSagaFallback")
    public Order executeOrderSaga(Order order) {
        log.info("Starting Order Saga for order: {}", order.getId());

        try {
            // Step 1: Reserve inventory for all items
            log.info("Step 1: Reserving inventory");
            reserveInventory(order);
            order.setStatus(Order.OrderStatus.PAYMENT_PENDING);
            order = orderRepository.save(order);

            // Step 2: Process payment
            log.info("Step 2: Processing payment");
            Long paymentId = processPayment(order);
            order.setPaymentId(paymentId);
            order.setStatus(Order.OrderStatus.PAYMENT_COMPLETED);
            order = orderRepository.save(order);

            // Step 3: Confirm inventory reservation
            log.info("Step 3: Confirming inventory reservation");
            confirmInventory(order);
            order.setStatus(Order.OrderStatus.CONFIRMED);
            order = orderRepository.save(order);

            log.info("Order Saga completed successfully for order: {}", order.getId());
            return order;

        } catch (Exception e) {
            log.error("Order Saga failed for order: {}. Starting compensation", order.getId(), e);
            compensate(order);
            throw e;
        }
    }

    private void reserveInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            try {
                inventoryClient.reserveStock(item.getProductId(), item.getQuantity());
                log.info("Reserved {} units of product {}", item.getQuantity(), item.getProductId());
            } catch (Exception e) {
                log.error("Failed to reserve inventory for product: {}", item.getProductId(), e);
                throw new RuntimeException("Inventory reservation failed for product: " + item.getProductId(), e);
            }
        }
    }

    private Long processPayment(Order order) {
        try {
            var paymentRequest = new PaymentRequestDto(
                    order.getId(),
                    order.getUserId(),
                    order.getTotalAmount(),
                    order.getPaymentMethod()
            );

            var response = paymentClient.processPayment(paymentRequest);
            
            if (response.getData() != null && response.getData().getId() != null) {
                log.info("Payment processed successfully: {}", response.getData().getId());
                return response.getData().getId();
            } else {
                throw new RuntimeException("Payment processing failed");
            }
        } catch (Exception e) {
            log.error("Payment processing failed for order: {}", order.getId(), e);
            throw new RuntimeException("Payment processing failed", e);
        }
    }

    private void confirmInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            try {
                inventoryClient.confirmReservation(item.getProductId(), item.getQuantity());
                log.info("Confirmed {} units of product {}", item.getQuantity(), item.getProductId());
            } catch (Exception e) {
                log.error("Failed to confirm inventory for product: {}", item.getProductId(), e);
                throw new RuntimeException("Inventory confirmation failed for product: " + item.getProductId(), e);
            }
        }
    }

    @Transactional
    public void compensate(Order order) {
        log.info("Starting compensation for order: {}", order.getId());

        // Release reserved inventory
        for (OrderItem item : order.getItems()) {
            try {
                inventoryClient.releaseStock(item.getProductId(), item.getQuantity());
                log.info("Released {} units of product {}", item.getQuantity(), item.getProductId());
            } catch (Exception e) {
                log.error("Failed to release inventory for product: {}", item.getProductId(), e);
            }
        }

        // Update order status
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason("Order processing failed - inventory or payment issue");
        orderRepository.save(order);

        log.info("Compensation completed for order: {}", order.getId());
    }

    public Order orderSagaFallback(Order order, Exception e) {
        log.error("Circuit breaker activated for order saga. Order: {}", order.getId(), e);
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason("Service temporarily unavailable");
        return orderRepository.save(order);
    }
}
