package com.example.commerza.order.repository;

import com.example.commerza.order.entity.Order;
import com.example.commerza.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}