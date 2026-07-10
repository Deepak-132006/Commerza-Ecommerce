package com.example.commerza.cart.service;

import com.example.commerza.cart.dto.AddToCartRequest;
import com.example.commerza.cart.dto.CartItemResponse;
import com.example.commerza.cart.dto.CartResponse;
import com.example.commerza.cart.entity.Cart;
import com.example.commerza.cart.entity.CartItem;
import com.example.commerza.cart.repository.CartItemRepository;
import com.example.commerza.cart.repository.CartRepository;
import com.example.commerza.product.entity.Product;
import com.example.commerza.product.repository.ProductRepository;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.repository.UserRespository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    private final UserRespository userRespository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(UserRespository userRespository, ProductRepository productRepository, CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.userRespository = userRespository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public CartResponse addToCart(AddToCartRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("User not found");
        }
        User user = (User) auth.getPrincipal();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });


        Optional<CartItem> existingItem =
                cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {


            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);

        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setPriceAtAddition(product.getPrice());

            cartItemRepository.save(item);
        }


        List<CartItem> items = cartItemRepository.findByCart(cart);

        BigDecimal totalPrice = items.stream()
                .map(i -> i.getPriceAtAddition()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        List<CartItemResponse> itemResponses = items.stream()
                .map(i -> CartItemResponse.builder()
                        .cartItemId(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .imageUrl(i.getProduct().getImageUrl())
                        .unitPrice(i.getPriceAtAddition())
                        .quantity(i.getQuantity())
                        .subtotal(
                                i.getPriceAtAddition()
                                        .multiply(BigDecimal.valueOf(i.getQuantity()))
                        )
                        .build())
                .toList();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(user.getId())
                .items(itemResponses)
                .totalPrice(totalPrice)
                .totalItems(totalItems)
                .build();
    }

    public CartResponse getCart() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new RuntimeException("User not found");
        }
        User user = (User) auth.getPrincipal();
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCart(cart);

        List<CartItemResponse> itemResponses = items.stream()
                .map(i -> CartItemResponse.builder()
                        .cartItemId(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .imageUrl(i.getProduct().getImageUrl())
                        .unitPrice(i.getPriceAtAddition())
                        .quantity(i.getQuantity())
                        .subtotal(
                                i.getPriceAtAddition()
                                        .multiply(BigDecimal.valueOf(i.getQuantity()))
                        )
                        .build())
                .toList();

        BigDecimal totalPrice = items.stream()
                .map(i -> i.getPriceAtAddition()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(user.getId())
                .items(itemResponses)
                .totalPrice(totalPrice)
                .totalItems(totalItems)
                .build();
    }

    public CartResponse updateCartItem(Long cartItemId, Integer quantity) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return getCart();
        }

        Product product = item.getProduct();

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCart();
    }

    @Transactional
    public CartResponse removeCartItem(Long cartItemId) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(item);

        return getCart();
    }

    @Transactional
    public CartResponse clearCart() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new RuntimeException("User not found");
        }
        User user = (User) auth.getPrincipal();
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteAllByCart(cart);

        return getCart();
    }
}
