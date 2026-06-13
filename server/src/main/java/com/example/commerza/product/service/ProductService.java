package com.example.commerza.product.service;

import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;

public interface ProductService {
    ProductResponse createProduct(CreateProductRequest request);
}
