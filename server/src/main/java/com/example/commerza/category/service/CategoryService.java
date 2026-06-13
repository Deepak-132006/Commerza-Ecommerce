package com.example.commerza.category.service;

import com.example.commerza.category.dto.*;

import java.util.List;

public interface CategoryService {
    CreateCategoryResponse createCategory(CreateCategoryRequest request);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);
    CategoryResponse disableCategory(Long id);
    CategoryResponse enableCategory(Long id);
}
