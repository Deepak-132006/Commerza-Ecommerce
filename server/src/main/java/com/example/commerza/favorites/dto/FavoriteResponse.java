package com.example.commerza.favorites.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class FavoriteResponse {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    private LocalDateTime createdAt;
}
