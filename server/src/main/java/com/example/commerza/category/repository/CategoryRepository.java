package com.example.commerza.category.repository;

import com.example.commerza.category.entity.Category;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActive(boolean active);
    Optional<Category> findByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}
