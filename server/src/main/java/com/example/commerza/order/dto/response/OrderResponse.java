package com.example.commerza.order.dto.response;

import com.example.commerza.order.entity.Order;
import com.example.commerza.order.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;

    private String orderNumber;

    private OrderStatus status;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private Order.Payment paymentMethod;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}