package com.ecommerce.order.client;

import com.ecommerce.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "inventory-service")
public interface InventoryClient {
    
    @PostMapping("/api/inventory/reserve/{productId}")
    ApiResponse<Void> reserveStock(@PathVariable Long productId, @RequestParam Integer quantity);
    
    @PostMapping("/api/inventory/release/{productId}")
    ApiResponse<Void> releaseStock(@PathVariable Long productId, @RequestParam Integer quantity);
    
    @PostMapping("/api/inventory/confirm/{productId}")
    ApiResponse<Void> confirmReservation(@PathVariable Long productId, @RequestParam Integer quantity);
}
