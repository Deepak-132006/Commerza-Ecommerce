package com.example.commerza.cart.repository;

import com.example.commerza.cart.entity.Cart;
import com.example.commerza.cart.entity.CartItem;
import com.example.commerza.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<Long, CartItem> {
    List<CartItem> findByCart(Cart cart);

    List<CartItem> findByCartId(Long cartId);

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    void deleteByCart(Cart cart);
}
