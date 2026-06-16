package com.example.commerza.product.service;

import com.example.commerza.category.entity.Category;
import com.example.commerza.category.repository.CategoryRepository;
import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.dto.UpdateProductRequest;
import com.example.commerza.product.entity.Product;
import com.example.commerza.product.mapper.ProductMapper;
import com.example.commerza.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductMapper productMapper, ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productMapper = productMapper;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {
        Product entity = new Product();
        if (request.getCategoryId() == null) {
            throw new NoSuchElementException("Category id is required");
        }

        Optional<Category> category = categoryRepository.findById(request.getCategoryId());
        if (category.isEmpty()) {
            throw new NoSuchElementException("Category not found");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }

        if (productRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Product already exists");
        }

        if (request.getStock() < 0) {
            throw new IllegalArgumentException("Stock should not be negative");
        }

        if (request.getPrice() != null && request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        entity = productMapper.toEntity(request);

        Product saved = productRepository.save(entity);
        return productMapper.toResponse(saved);

    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        if (!product.isActive()) {
            throw new NoSuchElementException("Product is not active");
        }
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse getAllProduct() {
        List<Product> product = productRepository.findAll();
        return productMapper.toResponse((Product) List.of(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Optional<Product> entity = productRepository.findById(id);
        if (entity.isEmpty()) {
            throw new NoSuchElementException("Product not found");
        }

        Product product = entity.get();

        if (!product.getName().equals(request.getName())) {
            if (productRepository.existsByName(request.getName())) {
                throw new IllegalArgumentException("Product already exists");
            }
        }

        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new IllegalArgumentException("Description is Required");
        }

        if (request.getPrice() != null && request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        if (request.getStock() < 0) {
            throw new IllegalArgumentException("Stock should not be negative");
        }

        if (request.getCategoryId() == null) {
            throw new NoSuchElementException("Category is required");
        }

        Optional<Category> categoryEntity = categoryRepository.findById(request.getCategoryId());

        if (categoryEntity.isEmpty()) {
            throw new NoSuchElementException("Category not found");
        }

        if (request.getImageUrl() == null) {
            throw new NoSuchElementException("Image URL is required");
        }


        productMapper.updateProductFromRequest(request, product);
        product.setCategory(categoryEntity.get());
        Product saved = productRepository.save(product);

        return productMapper.toResponse(saved);
    }
}
