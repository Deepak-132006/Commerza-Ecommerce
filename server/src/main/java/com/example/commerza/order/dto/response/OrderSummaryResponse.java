package com.example.commerza.order.dto.response;

import com.example.commerza.order.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSummaryResponse {

    private Long orderId;

    private String orderNumber;

    private OrderStatus status;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;
}