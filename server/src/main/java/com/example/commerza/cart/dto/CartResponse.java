package com.example.commerza.cart.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long cartId;

    private Long userId;

    private List<CartItemResponse> items;

    private BigDecimal totalPrice;
}