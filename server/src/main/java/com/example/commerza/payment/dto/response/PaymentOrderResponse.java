package com.example.commerza.payment.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderResponse {

    private Long orderId;

    private String razorpayOrderId;

    private String keyId;

    private BigDecimal amount;

    private String currency;
}