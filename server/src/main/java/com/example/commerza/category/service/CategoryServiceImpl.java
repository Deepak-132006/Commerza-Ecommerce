package com.example.commerza.category.service;

import com.example.commerza.category.dto.CategoryResponse;
import com.example.commerza.category.dto.CreateCategoryRequest;
import com.example.commerza.category.dto.CreateCategoryResponse;
import com.example.commerza.category.dto.UpdateCategoryRequest;
import com.example.commerza.category.entity.Category;
import com.example.commerza.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CreateCategoryResponse createCategory(CreateCategoryRequest request) {
        CreateCategoryResponse response = new CreateCategoryResponse();
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        categoryRepository.findByName(request.getName())
                .ifPresent(cat -> {
                    throw new IllegalArgumentException("Category already exists");
                });
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        Category saved = categoryRepository.save(category);

        response = CreateCategoryResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .active(saved.isActive())
                .createdAt(saved.getCreatedAt())
                .message("Created a new category")
                .build();

        return response;
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Category not found"));

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setActive(category.isActive());
        return response;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> entity = categoryRepository.findAll();
        List<CategoryResponse> response = entity.stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .active(category.isActive())
                        .build())
                .toList();
        return response;
    }

    @Override
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Category not found")
                );
        boolean exists = categoryRepository.existsByNameAndIdNot(
                request.getName(),
                id
        );

        if (exists) {
            throw new IllegalArgumentException("Category already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        Category saved = categoryRepository.save(category);

        return CategoryResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .active(saved.isActive())
                .build();

    }

    @Override
    public CategoryResponse disableCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found")
                );
        CategoryResponse response = new CategoryResponse();
        category.setActive(false);
        categoryRepository.save(category);

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.isActive())
                .build();
    }

    @Override
    public CategoryResponse enableCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found")
                );
        CategoryResponse response = new CategoryResponse();
        category.setActive(true);
        categoryRepository.save(category);

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.isActive())
                .build();
    }
}