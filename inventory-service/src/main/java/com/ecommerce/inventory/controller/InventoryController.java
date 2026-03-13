package com.ecommerce.inventory.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.inventory.dto.InventoryRequest;
import com.ecommerce.inventory.dto.InventoryResponse;
import com.ecommerce.inventory.dto.StockCheckRequest;
import com.ecommerce.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory Management", description = "APIs for inventory management")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @Operation(summary = "Create inventory for a product")
    public ResponseEntity<ApiResponse<InventoryResponse>> createInventory(
            @Valid @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.createInventory(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Inventory created successfully", response));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get inventory by product ID")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByProductId(
            @PathVariable Long productId) {
        InventoryResponse response = inventoryService.getInventoryByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> response = inventoryService.getAllInventory();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock items")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockItems() {
        List<InventoryResponse> response = inventoryService.getLowStockItems();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/check")
    @Operation(summary = "Check if stock is available")
    public ResponseEntity<ApiResponse<Boolean>> checkStock(
            @Valid @RequestBody StockCheckRequest request) {
        boolean available = inventoryService.checkStock(request);
        return ResponseEntity.ok(ApiResponse.success(available));
    }

    @PostMapping("/reserve/{productId}")
    @Operation(summary = "Reserve stock for a product")
    public ResponseEntity<ApiResponse<InventoryResponse>> reserveStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        InventoryResponse response = inventoryService.reserveStock(productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock reserved successfully", response));
    }

    @PostMapping("/release/{productId}")
    @Operation(summary = "Release reserved stock")
    public ResponseEntity<ApiResponse<InventoryResponse>> releaseStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        InventoryResponse response = inventoryService.releaseStock(productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock released successfully", response));
    }

    @PostMapping("/confirm/{productId}")
    @Operation(summary = "Confirm reservation and deduct stock")
    public ResponseEntity<ApiResponse<InventoryResponse>> confirmReservation(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        InventoryResponse response = inventoryService.confirmReservation(productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Reservation confirmed successfully", response));
    }

    @PostMapping("/add/{productId}")
    @Operation(summary = "Add stock to inventory")
    public ResponseEntity<ApiResponse<InventoryResponse>> addStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        InventoryResponse response = inventoryService.addStock(productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock added successfully", response));
    }

    @PutMapping("/product/{productId}")
    @Operation(summary = "Update inventory")
    public ResponseEntity<ApiResponse<InventoryResponse>> updateInventory(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.updateInventory(productId, request);
        return ResponseEntity.ok(ApiResponse.success("Inventory updated successfully", response));
    }
}
