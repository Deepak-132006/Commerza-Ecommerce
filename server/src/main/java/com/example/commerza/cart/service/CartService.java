package com.example.commerza.cart.service;

import com.example.commerza.cart.dto.AddToCartRequest;
import com.example.commerza.cart.dto.CartResponse;
import org.springframework.stereotype.Service;

public interface CartService {

    CartResponse addToCart(AddToCartRequest request);
    CartResponse getCart();
    CartResponse updateCartItem(Long cartItemId, Integer quantity);
    CartResponse removeCartItem(Long cartItemId);
    CartResponse clearCart();
}
