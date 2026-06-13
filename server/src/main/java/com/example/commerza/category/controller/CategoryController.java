package com.example.commerza.category.controller;


import com.example.commerza.category.dto.CategoryResponse;
import com.example.commerza.category.dto.CreateCategoryRequest;
import com.example.commerza.category.dto.CreateCategoryResponse;
import com.example.commerza.category.dto.UpdateCategoryRequest;
import com.example.commerza.category.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<CreateCategoryResponse> createCategory(@RequestBody CreateCategoryRequest request) {
        CreateCategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity
                .ok()
                .body(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> response = categoryService.getAllCategories();
        return ResponseEntity
                .ok()
                .body(response);
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/admin/categories/{id}/disable")
    public ResponseEntity<CategoryResponse> disableCategory(@PathVariable Long id) {
        CategoryResponse response = categoryService.disableCategory(id);
        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/admin/categories/{id}/enable")
    public ResponseEntity<CategoryResponse> enableCategory(@PathVariable Long id){
        CategoryResponse response = categoryService.enableCategory(id);
        return ResponseEntity
                .ok()
                .body(response);
    }
}
