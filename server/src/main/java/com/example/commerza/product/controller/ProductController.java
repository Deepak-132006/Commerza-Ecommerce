package com.example.commerza.product.controller;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.dto.UpdateProductRequest;
import com.example.commerza.product.service.ProductService;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/admin/products")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request){
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/products")
    public ResponseEntity <List<ProductResponse>> getAllProducts(){
        List<ProductResponse> response = productService.getAllProduct();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id){
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody UpdateProductRequest request){
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok()
                .body(response);
    }

    @PatchMapping("/admin/products/{id}/disable")
    public ResponseEntity<ProductResponse> disableProduct(@PathVariable Long id){
        ProductResponse response = productService.disableProduct(id);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/admin/products/{id}/enable")
    public ResponseEntity<ProductResponse> enableProduct(@PathVariable Long id){
        ProductResponse response = productService.enableProduct(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity <List<ProductResponse>> getProductByCategory(@PathVariable Long categoryId){
        List<ProductResponse> response = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/admin/products/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(@PathVariable Long id, @RequestParam @Min(0) Integer quantity){
        ProductResponse response = productService.updateStock(id, quantity);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/products/search")
    public ResponseEntity <List<ProductResponse>> searchProducts(@RequestParam String keyword){
        List<ProductResponse> response = productService.searchProducts(keyword);
        return ResponseEntity.ok().body(response);
    }

}
