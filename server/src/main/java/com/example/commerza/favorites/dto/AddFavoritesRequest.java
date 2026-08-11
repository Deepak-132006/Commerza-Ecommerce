package com.example.commerza.favorites.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddFavoritesRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;
}
