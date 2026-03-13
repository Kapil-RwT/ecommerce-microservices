package com.ecommerce.order.client;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.order.client.dto.PaymentDto;
import com.ecommerce.order.client.dto.PaymentRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service")
public interface PaymentClient {
    
    @PostMapping("/api/payments/process")
    ApiResponse<PaymentDto> processPayment(@RequestBody PaymentRequestDto request);
}
