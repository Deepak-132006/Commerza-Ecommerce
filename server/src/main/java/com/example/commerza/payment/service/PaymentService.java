package com.example.commerza.payment.service;

import com.example.commerza.order.dto.response.OrderItemResponse;
import com.example.commerza.order.dto.response.OrderResponse;
import com.example.commerza.order.entity.Order;
import com.example.commerza.order.entity.OrderItem;
import com.example.commerza.order.entity.OrderStatus;
import com.example.commerza.order.repository.OrderItemRepository;
import com.example.commerza.order.repository.OrderRepository;
import com.example.commerza.payment.dto.request.CreatePaymentOrderRequest;
import com.example.commerza.payment.dto.request.VerifyPaymentRequest;
import com.example.commerza.payment.dto.response.PaymentOrderResponse;
import com.example.commerza.payment.entity.Payment;
import com.example.commerza.payment.entity.PaymentStatus;
import com.example.commerza.payment.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(RazorpayClient razorpayClient, OrderRepository orderRepository, PaymentRepository paymentRepository, OrderItemRepository orderItemRepository, OrderItemRepository orderItemRepository1
    ) {
        this.razorpayClient = razorpayClient;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.orderItemRepository = orderItemRepository1;
    }

    @Transactional
    public PaymentOrderResponse createPaymentOrder(CreatePaymentOrderRequest request) throws RazorpayException {

        // Step 1: Find Commerza Order

        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));

        // Step 2: Check if payment already exists

        if (paymentRepository.findByOrder(order).isPresent()) {
            throw new RuntimeException("Payment already created for this order");
        }

        // Step 3: Get amount from our Order

        BigDecimal amount = order.getTotalAmount();

        // Step 4: Convert INR to paise

        long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValueExact();

        // Step 5: Create Razorpay Order

        JSONObject razorpayOrderRequest = new JSONObject();

        razorpayOrderRequest.put("amount", amountInPaise);
        razorpayOrderRequest.put("currency", "INR");
        razorpayOrderRequest.put("receipt", order.getOrderNumber());

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(razorpayOrderRequest);

        // Step 6: Get Razorpay Order ID

        String razorpayOrderId = razorpayOrder.get("id");

        // Step 7: Create Payment entity

        Payment payment = Payment.builder().order(order).razorpayOrderId(razorpayOrderId).amount(amount).currency("INR").status(PaymentStatus.PENDING).build();

        // Step 8: Save Payment

        paymentRepository.save(payment);

        // Step 9: Return response

        return PaymentOrderResponse.builder().orderId(order.getId()).razorpayOrderId(razorpayOrderId).keyId(keyId).amount(amount).currency("INR").build();
    }

    @Transactional
    public OrderResponse verifyPayment(VerifyPaymentRequest request) throws RazorpayException {

        // Step 1: Find Commerza Order

        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> new NoSuchElementException("Order not found"));

        // Step 2: Find Payment

        Payment payment = paymentRepository.findByOrder(order).orElseThrow(() -> new NoSuchElementException("Payment not found"));

        // Step 3: Verify Razorpay Order ID

        if (!payment.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {

            throw new IllegalArgumentException("Razorpay order ID does not match");
        }

        // Step 4: Generate signature

        String generatedSignature = Utils.getHash(request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(), razorpayKeySecret);

        // Step 5: Compare signatures

        if (!generatedSignature.equals(request.getRazorpaySignature())) {

            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            throw new IllegalArgumentException("Invalid payment signature");
        }

        // Step 6: Payment verified successfully

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());

        payment.setSignature(request.getRazorpaySignature());

        payment.setStatus(PaymentStatus.CAPTURED);

        paymentRepository.save(payment);

        // Step 7: Confirm Order

        order.setStatus(OrderStatus.CONFIRMED);

        orderRepository.save(order);

        // Step 8: Get Order Items

        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        // Step 9: Build response

        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for (OrderItem item : orderItems) {

            OrderItemResponse itemResponse = OrderItemResponse.builder().productId(item.getProduct().getId()).productName(item.getProduct().getName()).productImage(item.getProduct().getImageUrl()).quantity(item.getQuantity()).price(item.getPrice()).subtotal(item.getSubtotal()).build();

            itemResponses.add(itemResponse);
        }

        // Step 10: Return OrderResponse

        return OrderResponse.builder().orderId(order.getId()).orderNumber(order.getOrderNumber()).status(order.getStatus()).totalAmount(order.getTotalAmount()).shippingAddress(order.getShippingAddress()).paymentMethod(order.getPaymentMethod()).createdAt(order.getCreatedAt()).items(itemResponses).build();
    }
}