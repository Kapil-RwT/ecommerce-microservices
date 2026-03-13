package com.ecommerce.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "payment-events", groupId = "notification-service")
    public void handlePaymentEvent(String message) {
        log.info("Received payment event: {}", message);
        // In production, send email/SMS/push notification
        sendNotification("Payment notification", message);
    }

    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void handleOrderEvent(String message) {
        log.info("Received order event: {}", message);
        // In production, send email/SMS/push notification
        sendNotification("Order notification", message);
    }

    private void sendNotification(String subject, String message) {
        // Simulate sending notification
        log.info("Sending notification - Subject: {}, Message: {}", subject, message);
        // In production: integrate with email service (SendGrid, AWS SES)
        // or SMS service (Twilio) or push notification service (Firebase)
    }
}
