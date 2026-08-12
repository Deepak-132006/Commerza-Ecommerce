package com.example.commerza.payment.controller;

import com.example.commerza.order.dto.response.OrderResponse;
import com.example.commerza.payment.dto.request.CreatePaymentOrderRequest;
import com.example.commerza.payment.dto.request.VerifyPaymentRequest;
import com.example.commerza.payment.dto.response.PaymentOrderResponse;
import com.example.commerza.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(
            @Valid @RequestBody CreatePaymentOrderRequest request
    ) throws Exception {

        PaymentOrderResponse response =
                paymentService.createPaymentOrder(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderResponse> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request
    ) throws Exception {

        OrderResponse response =
                paymentService.verifyPayment(request);

        return ResponseEntity.ok(response);
    }
}