package com.example.commerza.favorites.repository;

import com.example.commerza.favorites.entity.Favorites;
import com.example.commerza.product.entity.Product;
import com.example.commerza.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorites, Long> {
    List<Favorites> findByUser(User user);

    Optional<Favorites> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    void deleteByUserAndProduct(User user, Product product);
}
