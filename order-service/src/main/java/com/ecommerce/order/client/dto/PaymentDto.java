package com.ecommerce.order.client.dto;

import lombok.Data;

@Data
public class PaymentDto {
    private Long id;
    private Long orderId;
    private String status;
}
