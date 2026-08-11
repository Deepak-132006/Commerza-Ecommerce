package com.example.commerza.favorites.controller;

import com.example.commerza.favorites.dto.AddFavoritesRequest;
import com.example.commerza.favorites.dto.FavoriteResponse;
import com.example.commerza.favorites.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favourites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavourite(
            @Valid @RequestBody AddFavoritesRequest request) {

        FavoriteResponse response =
                favoriteService.addFavourite(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getMyFavourites() {

        List<FavoriteResponse> response =
                favoriteService.getMyFavourites();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavourite(
            @PathVariable Long productId) {

        favoriteService.removeFavourite(productId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<Boolean> isFavourite(
            @PathVariable Long productId) {

        boolean response =
                favoriteService.isFavourite(productId);

        return ResponseEntity.ok(response);
    }
}