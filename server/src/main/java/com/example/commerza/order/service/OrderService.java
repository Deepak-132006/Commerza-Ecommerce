package com.example.commerza.order.service;

import com.example.commerza.cart.entity.Cart;
import com.example.commerza.cart.entity.CartItem;
import com.example.commerza.cart.repository.CartItemRepository;
import com.example.commerza.cart.repository.CartRepository;
import com.example.commerza.order.dto.request.BuyNowRequest;
import com.example.commerza.order.dto.request.PlaceOrderRequest;
import com.example.commerza.order.dto.request.UpdateOrderStatusRequest;
import com.example.commerza.order.dto.response.OrderItemResponse;
import com.example.commerza.order.dto.response.OrderProductSummary;
import com.example.commerza.order.dto.response.OrderResponse;
import com.example.commerza.order.dto.response.OrderSummaryResponse;
import com.example.commerza.order.entity.Order;
import com.example.commerza.order.entity.OrderItem;
import com.example.commerza.order.entity.OrderStatus;
import com.example.commerza.order.repository.OrderItemRepository;
import com.example.commerza.order.repository.OrderRepository;
import com.example.commerza.product.entity.Product;
import com.example.commerza.product.repository.ProductRepository;
import com.example.commerza.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.ThreadLocalRandom;


@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderService(CartRepository cartRepository, CartItemRepository cartItemRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    private String generateOrderNumber() {
        String companyId = "COM";

        long number = ThreadLocalRandom.current()
                .nextLong(10_000_000_000L, 100_000_000_000L);

        return companyId + number;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {

        // Step 1: Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("User not found");
        }
        User user = (User) auth.getPrincipal();

        // Step 2: Find user's cart
        // Step 3: Validate cart exists
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NoSuchElementException("Cart not found"));

        // Step 4: Get cart items
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        // Step 5: Validate cart is not empty

        if (cartItems.isEmpty()) {
            throw new NoSuchElementException("Cart items not found");
        }
        // Step 6: Validate each cart item
        // - product exists
        // - product active
        // - stock available
        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();


            if (product == null) {
                throw new NoSuchElementException("Product not found");
            }

            if (!product.isActive()) {
                throw new IllegalArgumentException(product.getName() + " is inactive");
            }

            if (product.getStock() < cartItem.getQuantity()) {
                throw new NoSuchElementException(
                        "Only " + product.getStock() +
                                " item(s) available for " + product.getName()
                );
            }
        }
        // Step 7: Calculate totals

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            totalAmount = totalAmount.add(subtotal);
        }

        // Step 8: Create Order entity
        Order order = Order.builder()
                .user(user)
                .orderNumber(generateOrderNumber())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .totalAmount(totalAmount)
                .build();
        // Step 9: Save Order
        orderRepository.save(order);
        // Step 10: Create OrderItems

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .productImage(product.getImageUrl())
                    .productName(product.getName())
                    .subtotal(subtotal)
                    .build();
            orderItems.add(orderItem);
        }


        // Step 11: Save OrderItems
        orderItemRepository.saveAll(orderItems);
        List<OrderItem> savedItems = orderItemRepository.findByOrder(order);

        // Get first product image
        String productImage = orderItems.isEmpty()
                ? null
                : orderItems.get(0).getProductImage();
        // Step 12: Reduce product stock
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );
        }
        productRepository.saveAll(
                cartItems.stream()
                        .map(CartItem::getProduct)
                        .toList()
        );
        // Step 13: Clear cart
        cartItemRepository.deleteAll(cartItems);
        // Step 14: Build and return OrderResponse
        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .productImage(productImage)
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {

        // Step 1: Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new NoSuchElementException("Order not found"));

        // Step 3: Verify ownership (or ADMIN)
        boolean isOwner = order.getUser().getId().equals(user.getId());

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new SecurityException("You are not authorized to view this order");
        }

// Step 4
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

// First product image
        String productImage = orderItems.isEmpty()
                ? null
                : orderItems.get(0).getProductImage();

// Step 5
        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

// Step 6
        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .productImage(productImage)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getMyOrders() {

        // Step 1: Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Find all orders of the user
        List<Order> orders = orderRepository.findByUser(user);

        // Step 3: Map to OrderSummaryResponse
        return orders.stream()
                .map(order -> {

                    List<OrderProductSummary> products = order.getOrderItems()
                            .stream()
                            .map(item -> OrderProductSummary.builder()
                                    .productId(item.getProduct().getId())
                                    .productName(item.getProductName())
                                    .productImage(item.getProductImage())
                                    .build())
                            .toList();

                    return OrderSummaryResponse.builder()
                            .orderId(order.getId())
                            .orderNumber(order.getOrderNumber())
                            .products(products)
                            .totalItems(order.getOrderItems().size())
                            .status(order.getStatus())
                            .totalAmount(order.getTotalAmount())
                            .createdAt(order.getCreatedAt())
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getAllOrders() {

        // Step 1: Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        // Step 2: Verify ADMIN role
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new SecurityException("Access denied");
        }

        // Step 3: Get all orders
        List<Order> orders = orderRepository.findAll();

        // Step 4: Map to DTO
        return orders.stream()
                .map(order -> {

                    List<OrderProductSummary> products = order.getOrderItems()
                            .stream()
                            .map(item -> OrderProductSummary.builder()
                                    .productId(item.getProduct().getId())
                                    .productName(item.getProductName())
                                    .productImage(item.getProductImage())
                                    .build())
                            .toList();

                    return OrderSummaryResponse.builder()
                            .orderId(order.getId())
                            .orderNumber(order.getOrderNumber())
                            .products(products)
                            .totalItems(order.getOrderItems().size())
                            .status(order.getStatus())
                            .totalAmount(order.getTotalAmount())
                            .createdAt(order.getCreatedAt())
                            .build();
                })
                .toList();
    }


    @Transactional
    public OrderResponse updateOrderStatus(Long orderId,
                                           UpdateOrderStatusRequest request) {

        // Step 1: Find Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new NoSuchElementException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // Step 2: Validate status transition
        boolean validTransition = switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED
                    || newStatus == OrderStatus.CANCELLED;

            case CONFIRMED -> newStatus == OrderStatus.SHIPPED
                    || newStatus == OrderStatus.CANCELLED;

            case SHIPPED -> newStatus == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED -> false;
        };

        if (!validTransition) {
            throw new IllegalArgumentException(
                    "Invalid status transition from "
                            + currentStatus + " to " + newStatus
            );
        }

        // Step 3: Update Status
        order.setStatus(newStatus);

        // Step 4: Save
        orderRepository.save(order);

        // Step 5: Fetch Order Items
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        // Step 6: Return Response
        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {

        // Step 1: Get Logged-in User
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Find Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new NoSuchElementException("Order not found"));

        // Step 3: Verify Ownership
        if (!order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to cancel this order");
        }

        // Step 4: Allow only PENDING or CONFIRMED
        if (order.getStatus() != OrderStatus.PENDING &&
                order.getStatus() != OrderStatus.CONFIRMED) {

            throw new IllegalStateException(
                    "Only pending or confirmed orders can be cancelled");
        }

        // Step 5: Restore Product Stock
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        for (OrderItem item : orderItems) {

            Product product = item.getProduct();

            product.setStock(
                    product.getStock() + item.getQuantity()
            );
        }

        productRepository.saveAll(
                orderItems.stream()
                        .map(OrderItem::getProduct)
                        .toList()
        );

        // Step 6: Update Status
        order.setStatus(OrderStatus.CANCELLED);

        // Step 7: Save Order
        orderRepository.save(order);

        // Step 8: Build Response
        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        // Step 9: Return Response
        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    @Transactional
    public OrderResponse buyNow(BuyNowRequest request) {

        // Step 1: Get logged-in user
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Step 2: Find product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new NoSuchElementException("Product not found"));

        // Step 3: Validate product
        if (!product.isActive()) {
            throw new IllegalArgumentException(
                    product.getName() + " is inactive"
            );
        }

        // Step 4: Validate stock
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException(
                    "Only " + product.getStock()
                            + " item(s) available for "
                            + product.getName()
            );
        }

        // Step 5: Calculate subtotal
        BigDecimal subtotal = product.getPrice()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        // Step 6: Create Order
        Order order = Order.builder()
                .user(user)
                .orderNumber(generateOrderNumber())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .totalAmount(subtotal)
                .build();

        // Step 7: Save Order
        orderRepository.save(order);

        // Step 8: Create OrderItem
        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(request.getQuantity())
                .price(product.getPrice())
                .subtotal(subtotal)
                .build();

        // Step 9: Save OrderItem
        orderItemRepository.save(orderItem);

        // Step 10: Reduce stock
        product.setStock(
                product.getStock() - request.getQuantity()
        );

        productRepository.save(product);

        // Step 11: Build OrderItemResponse
        List<OrderItemResponse> itemResponses = List.of(
                OrderItemResponse.builder()
                        .productId(product.getId())
                        .productName(product.getName())
                        .quantity(orderItem.getQuantity())
                        .price(orderItem.getPrice())
                        .subtotal(orderItem.getSubtotal())
                        .build()
        );

        // Step 12: Return OrderResponse
        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

}
