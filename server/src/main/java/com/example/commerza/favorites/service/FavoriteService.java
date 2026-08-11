package com.example.commerza.favorites.service;

import com.example.commerza.favorites.dto.AddFavoritesRequest;
import com.example.commerza.favorites.dto.FavoriteResponse;
import com.example.commerza.favorites.entity.Favorites;
import com.example.commerza.favorites.repository.FavoriteRepository;
import com.example.commerza.product.entity.Product;
import com.example.commerza.product.repository.ProductRepository;
import com.example.commerza.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            ProductRepository productRepository) {

        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public FavoriteResponse addFavourite(AddFavoritesRequest request) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new NoSuchElementException("Product not found"));

        if (!product.isActive()) {
            throw new IllegalArgumentException(
                    "Product is inactive"
            );
        }

        if (favoriteRepository.existsByUserAndProduct(user, product)) {
            throw new IllegalArgumentException(
                    "Product is already in favourites"
            );
        }

        Favorites favorite = Favorites.builder()
                .user(user)
                .product(product)
                .build();

        favoriteRepository.save(favorite);

        return FavoriteResponse.builder()
                .id(favorite.getId())
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .createdAt(favorite.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavourites() {

        // Step 1: Get logged-in user
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Get user's favourites
        List<Favorites> favourites =
                favoriteRepository.findByUser(user);

        // Step 3: Map to FavoriteResponse
        return favourites.stream()
                .map(favorite -> FavoriteResponse.builder()
                        .id(favorite.getId())
                        .productId(favorite.getProduct().getId())
                        .productName(favorite.getProduct().getName())
                        .price(favorite.getProduct().getPrice())
                        .imageUrl(favorite.getProduct().getImageUrl())
                        .createdAt(favorite.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public void removeFavourite(Long productId) {

        // Step 1: Get logged-in user
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Find product
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new NoSuchElementException("Product not found"));

        // Step 3: Check favourite exists
        Favorites favorite = favoriteRepository
                .findByUserAndProduct(user, product)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Product is not in your favourites"
                        ));

        // Step 4: Delete favourite
        favoriteRepository.delete(favorite);
    }

    @Transactional(readOnly = true)
    public boolean isFavourite(Long productId) {

        // Get logged-in user
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Find product
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new NoSuchElementException("Product not found"));

        // Check favourite
        return favoriteRepository.existsByUserAndProduct(user, product);
    }
}