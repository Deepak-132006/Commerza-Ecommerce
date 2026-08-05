package com.example.commerza.order.controller;

import com.example.commerza.order.dto.request.PlaceOrderRequest;
import com.example.commerza.order.dto.request.UpdateOrderStatusRequest;
import com.example.commerza.order.dto.response.OrderResponse;
import com.example.commerza.order.dto.response.OrderSummaryResponse;
import com.example.commerza.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {

        OrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId) {

        OrderResponse response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/my-orders")
    public ResponseEntity<List<OrderSummaryResponse>> getMyOrders() {

        List<OrderSummaryResponse> response = orderService.getMyOrders();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderSummaryResponse>> getAllOrders() {

        List<OrderSummaryResponse> response = orderService.getAllOrders();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        OrderResponse response =
                orderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId) {

        OrderResponse response = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(response);
    }
}