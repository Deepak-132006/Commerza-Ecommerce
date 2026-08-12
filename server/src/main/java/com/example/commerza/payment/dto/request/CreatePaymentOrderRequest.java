package com.example.commerza.payment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentOrderRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;
}