package com.example.commerza.product.service;

import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.dto.UpdateProductRequest;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(CreateProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProduct();
    ProductResponse updateProduct(Long id, UpdateProductRequest request);
    ProductResponse disableProduct(Long id);
    ProductResponse enableProduct(Long id);
    List<ProductResponse> getProductsByCategory(Long categoryId);
    ProductResponse updateStock(Long productId, Integer stock);
    List<ProductResponse> searchProducts(String keyword);
}
