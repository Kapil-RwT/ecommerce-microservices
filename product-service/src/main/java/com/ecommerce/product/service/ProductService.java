package com.ecommerce.product.service;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.model.ProductDocument;
import com.ecommerce.product.repository.ProductElasticsearchRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired(required = false)
    private ProductElasticsearchRepository elasticsearchRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating new product: {}", request.getName());

        if (productRepository.existsBySku(request.getSku())) {
            throw new BadRequestException("Product with SKU already exists: " + request.getSku());
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .category(request.getCategory())
                .brand(request.getBrand())
                .imageUrl(request.getImageUrl())
                .active(request.getActive())
                .featured(request.getFeatured())
                .color(request.getColor())
                .size(request.getSize())
                .weight(request.getWeight())
                .dimensions(request.getDimensions())
                .build();

        product = productRepository.save(product);
        
        // Index in Elasticsearch (optional)
        indexProductInElasticsearch(product);
        
        log.info("Product created successfully: {}", product.getId());
        return mapToProductResponse(product);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        log.info("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        log.info("Fetching product by SKU: {}", sku);
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + sku));
        return mapToProductResponse(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        log.info("Fetching all products");
        return productRepository.findAll(pageable)
                .map(this::mapToProductResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getActiveProducts(Pageable pageable) {
        log.info("Fetching active products");
        return productRepository.findByActiveTrue(pageable)
                .map(this::mapToProductResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        log.info("Fetching featured products");
        return productRepository.findByFeaturedTrue(pageable)
                .map(this::mapToProductResponse);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String category) {
        log.info("Fetching products by category: {}", category);
        return productRepository.findByCategory(category).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByBrand(String brand) {
        log.info("Fetching products by brand: {}", brand);
        return productRepository.findByBrand(brand).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        log.info("Searching products with keyword: {}", keyword);
        
        if (elasticsearchRepository != null) {
            try {
                // Try Elasticsearch first for better search performance
                Page<ProductDocument> elasticResults = elasticsearchRepository
                        .findByNameContainingOrDescriptionContaining(keyword, keyword, pageable);
                
                return elasticResults.map(doc -> {
                    Product product = productRepository.findById(Long.parseLong(doc.getId()))
                            .orElse(null);
                    return product != null ? mapToProductResponse(product) : null;
                });
            } catch (Exception e) {
                log.warn("Elasticsearch search failed, falling back to database search", e);
            }
        }
        
        // Fallback to database search
        return productRepository.searchProducts(keyword, pageable)
                .map(this::mapToProductResponse);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive());
        product.setFeatured(request.getFeatured());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());

        product = productRepository.save(product);
        
        // Update in Elasticsearch (optional)
        indexProductInElasticsearch(product);
        
        log.info("Product updated successfully: {}", product.getId());
        return mapToProductResponse(product);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setActive(false);
        productRepository.save(product);
        
        // Remove from Elasticsearch (optional)
        if (elasticsearchRepository != null) {
            try {
                elasticsearchRepository.deleteById(String.valueOf(id));
            } catch (Exception e) {
                log.warn("Failed to remove product from Elasticsearch: {}", id, e);
            }
        }
        
        log.info("Product deleted successfully: {}", id);
    }

    private void indexProductInElasticsearch(Product product) {
        if (elasticsearchRepository == null) {
            return;
        }
        try {
            ProductDocument document = ProductDocument.builder()
                    .id(String.valueOf(product.getId()))
                    .name(product.getName())
                    .description(product.getDescription())
                    .sku(product.getSku())
                    .price(product.getPrice())
                    .category(product.getCategory())
                    .brand(product.getBrand())
                    .active(product.getActive())
                    .featured(product.getFeatured())
                    .rating(product.getRating())
                    .build();
            
            elasticsearchRepository.save(document);
            log.info("Product indexed in Elasticsearch: {}", product.getId());
        } catch (Exception e) {
            log.warn("Failed to index product in Elasticsearch: {}", product.getId(), e);
        }
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .category(product.getCategory())
                .brand(product.getBrand())
                .imageUrl(product.getImageUrl())
                .active(product.getActive())
                .featured(product.getFeatured())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .color(product.getColor())
                .size(product.getSize())
                .weight(product.getWeight())
                .dimensions(product.getDimensions())
                .build();
    }
}
