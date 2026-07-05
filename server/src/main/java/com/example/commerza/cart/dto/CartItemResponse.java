package com.example.commerza.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long cartItemId;

    private Long productId;

    private String productName;

    private String imageUrl;

    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal subtotal;

}