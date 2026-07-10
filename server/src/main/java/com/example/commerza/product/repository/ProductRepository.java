package com.example.commerza.product.repository;

import com.example.commerza.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.invoke.CallSite;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    boolean existsByName(String name);
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);
}
