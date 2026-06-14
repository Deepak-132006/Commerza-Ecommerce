package com.example.commerza.product.service;

import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.mapper.ProductMapper;

public interface ProductService {

    ProductResponse createProduct(CreateProductRequest request);
    ProductResponse getProductById(Long id);
    ProductResponse getAllProduct();
}
