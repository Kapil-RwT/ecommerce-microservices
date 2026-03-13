package com.ecommerce.payment.service;

import com.ecommerce.common.exception.PaymentFailedException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.dto.PaymentResponse;
import com.ecommerce.payment.event.PaymentEvent;
import com.ecommerce.payment.model.Payment;
import com.ecommerce.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;
    private static final String PAYMENT_TOPIC = "payment-events";

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Processing payment for order: {}", request.getOrderId());

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(Payment.PaymentStatus.PROCESSING)
                .build();

        payment = paymentRepository.save(payment);

        try {
            // Simulate payment gateway processing
            boolean paymentSuccess = processPaymentGateway(request);

            if (paymentSuccess) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setTransactionId(UUID.randomUUID().toString());
                payment.setPaymentGatewayResponse("Payment successful");
                
                // Publish payment success event
                publishPaymentEvent(payment, "PAYMENT_COMPLETED");
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Payment declined by gateway");
                
                // Publish payment failed event
                publishPaymentEvent(payment, "PAYMENT_FAILED");
                
                throw new PaymentFailedException("Payment processing failed");
            }

            payment = paymentRepository.save(payment);
            log.info("Payment processed successfully for order: {}", request.getOrderId());
            
        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);
            
            // Publish payment failed event
            publishPaymentEvent(payment, "PAYMENT_FAILED");
            
            log.error("Payment processing failed for order: {}", request.getOrderId(), e);
            throw new PaymentFailedException("Payment processing failed: " + e.getMessage());
        }

        return mapToPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        log.info("Fetching payment by id: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return mapToPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        log.info("Fetching payment by order id: {}", orderId);
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return mapToPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        log.info("Fetching payments for user: {}", userId);
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse refundPayment(Long paymentId) {
        log.info("Processing refund for payment: {}", paymentId);
        
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new PaymentFailedException("Can only refund completed payments");
        }

        // Simulate refund processing
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment = paymentRepository.save(payment);
        
        // Publish refund event
        publishPaymentEvent(payment, "PAYMENT_REFUNDED");
        
        log.info("Refund processed successfully for payment: {}", paymentId);
        return mapToPaymentResponse(payment);
    }

    private boolean processPaymentGateway(PaymentRequest request) {
        // Simulate payment gateway call
        // In production, this would integrate with actual payment gateways like Stripe, PayPal, etc.
        log.info("Calling payment gateway for order: {}", request.getOrderId());
        
        try {
            Thread.sleep(1000); // Simulate network delay
            
            // Simulate 95% success rate
            return Math.random() < 0.95;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    private void publishPaymentEvent(Payment payment, String eventType) {
        try {
            PaymentEvent event = PaymentEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .userId(payment.getUserId())
                    .amount(payment.getAmount())
                    .status(payment.getStatus().name())
                    .eventType(eventType)
                    .transactionId(payment.getTransactionId())
                    .build();

            kafkaTemplate.send(PAYMENT_TOPIC, String.valueOf(payment.getOrderId()), event);
            log.info("Published payment event: {} for order: {}", eventType, payment.getOrderId());
        } catch (Exception e) {
            log.error("Failed to publish payment event for order: {}", payment.getOrderId(), e);
        }
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
