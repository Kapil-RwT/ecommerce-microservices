package com.ecommerce.inventory.service;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.InsufficientStockException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.inventory.dto.InventoryRequest;
import com.ecommerce.inventory.dto.InventoryResponse;
import com.ecommerce.inventory.dto.StockCheckRequest;
import com.ecommerce.inventory.model.Inventory;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public InventoryResponse createInventory(InventoryRequest request) {
        log.info("Creating inventory for product: {}", request.getProductId());

        if (inventoryRepository.findByProductId(request.getProductId()).isPresent()) {
            throw new BadRequestException("Inventory already exists for product: " + request.getProductId());
        }

        Inventory inventory = Inventory.builder()
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .reservedQuantity(0)
                .reorderLevel(request.getReorderLevel())
                .maxStockLevel(request.getMaxStockLevel())
                .build();

        inventory = inventoryRepository.save(inventory);
        log.info("Inventory created successfully for product: {}", request.getProductId());
        return mapToInventoryResponse(inventory);
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        log.info("Fetching inventory for product: {}", productId);
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));
        return mapToInventoryResponse(inventory);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        log.info("Fetching all inventory");
        return inventoryRepository.findAll().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockItems() {
        log.info("Fetching low stock items");
        return inventoryRepository.findLowStockItems().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean checkStock(StockCheckRequest request) {
        log.info("Checking stock for product: {} quantity: {}", 
                request.getProductId(), request.getQuantity());
        
        Inventory inventory = inventoryRepository.findByProductId(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + request.getProductId()));
        
        return inventory.hasStock(request.getQuantity());
    }

    @Transactional
    public InventoryResponse reserveStock(Long productId, Integer quantity) {
        log.info("Reserving stock for product: {} quantity: {}", productId, quantity);
        
        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        if (!inventory.hasStock(quantity)) {
            throw new InsufficientStockException(
                    String.format("Insufficient stock for product %d. Available: %d, Requested: %d",
                            productId, inventory.getAvailableQuantity(), quantity));
        }

        inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);
        inventory = inventoryRepository.save(inventory);
        
        log.info("Stock reserved successfully for product: {}", productId);
        return mapToInventoryResponse(inventory);
    }

    @Transactional
    public InventoryResponse releaseStock(Long productId, Integer quantity) {
        log.info("Releasing reserved stock for product: {} quantity: {}", productId, quantity);
        
        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        if (inventory.getReservedQuantity() < quantity) {
            throw new BadRequestException("Cannot release more stock than reserved");
        }

        inventory.setReservedQuantity(inventory.getReservedQuantity() - quantity);
        inventory = inventoryRepository.save(inventory);
        
        log.info("Stock released successfully for product: {}", productId);
        return mapToInventoryResponse(inventory);
    }

    @Transactional
    public InventoryResponse confirmReservation(Long productId, Integer quantity) {
        log.info("Confirming reservation for product: {} quantity: {}", productId, quantity);
        
        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        if (inventory.getReservedQuantity() < quantity) {
            throw new BadRequestException("Cannot confirm more stock than reserved");
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventory.setReservedQuantity(inventory.getReservedQuantity() - quantity);
        inventory = inventoryRepository.save(inventory);
        
        log.info("Reservation confirmed successfully for product: {}", productId);
        return mapToInventoryResponse(inventory);
    }

    @Transactional
    public InventoryResponse addStock(Long productId, Integer quantity) {
        log.info("Adding stock for product: {} quantity: {}", productId, quantity);
        
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        inventory.setQuantity(inventory.getQuantity() + quantity);
        inventory = inventoryRepository.save(inventory);
        
        log.info("Stock added successfully for product: {}", productId);
        return mapToInventoryResponse(inventory);
    }

    @Transactional
    public InventoryResponse updateInventory(Long productId, InventoryRequest request) {
        log.info("Updating inventory for product: {}", productId);
        
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        inventory.setQuantity(request.getQuantity());
        inventory.setReorderLevel(request.getReorderLevel());
        inventory.setMaxStockLevel(request.getMaxStockLevel());
        
        inventory = inventoryRepository.save(inventory);
        log.info("Inventory updated successfully for product: {}", productId);
        return mapToInventoryResponse(inventory);
    }

    private InventoryResponse mapToInventoryResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .quantity(inventory.getQuantity())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .reorderLevel(inventory.getReorderLevel())
                .maxStockLevel(inventory.getMaxStockLevel())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .needsReorder(inventory.getReorderLevel() != null && 
                             inventory.getQuantity() <= inventory.getReorderLevel())
                .build();
    }
}
