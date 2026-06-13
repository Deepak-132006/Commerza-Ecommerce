package com.example.commerza.product.service;

import com.example.commerza.category.entity.Category;
import com.example.commerza.category.repository.CategoryRepository;
import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.entity.Product;
import com.example.commerza.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {

        if (request.getCategoryId() == null) {
            throw new NoSuchElementException("Catergory id is required");
        }

        Optional<Category> category = categoryRepository.findById(request.getCategoryId());
        if (category.isEmpty()) {
            throw new NoSuchElementException("Category not found");
        }

        if (request.getName().isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }

        Product product = productRepository.findByName(request.getName());
        if (product == null) {
            throw new NoSuchElementException("Product already exists");
}
            if (product.getStock() >= 0) {
                throw new IllegalArgumentException("Stock should not be negative");
            }


        Product product1 = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category.get())
                .imageUrl("URL here")
                .description(request.getDescription())
                .build();

        Product saved = productRepository.save(product1);

        return ProductResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .price(saved.getPrice())
                .category(saved.getCategory())
                .stock(saved.getStock())
                .imageUrl(saved.getImageUrl())
                .build();

    }
}
