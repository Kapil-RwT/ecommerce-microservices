package com.ecommerce.product.repository;

import com.ecommerce.product.model.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductDocument, String> {
    Page<ProductDocument> findByNameContainingOrDescriptionContaining(
            String name, String description, Pageable pageable);
    
    List<ProductDocument> findByCategory(String category);
    List<ProductDocument> findByBrand(String brand);
    Page<ProductDocument> findByActiveTrue(Pageable pageable);
    Page<ProductDocument> findByFeaturedTrue(Pageable pageable);
}
