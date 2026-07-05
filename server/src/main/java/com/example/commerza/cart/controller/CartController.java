package com.example.commerza.cart.controller;

import com.example.commerza.cart.dto.AddToCartRequest;
import com.example.commerza.cart.dto.CartResponse;
import com.example.commerza.cart.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddToCartRequest request) {

        CartResponse response = cartService.addToCart(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {

        CartResponse response = cartService.getCart();
        return ResponseEntity
                .ok()
                .body(response);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        CartResponse response = cartService.updateCartItem(cartItemId, quantity);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long cartItemId) {

        CartResponse response = cartService.removeCartItem(cartItemId);

        return ResponseEntity
                .ok()
                .body(response);
    }


    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart() {

        CartResponse response = cartService.clearCart();

        return ResponseEntity
                .ok()
                .body(response);
    }
}