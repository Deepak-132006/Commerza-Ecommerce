package com.example.commerza.order.repository;

import com.example.commerza.order.entity.Order;
import com.example.commerza.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUser(User user);

    boolean existsByOrderNumber(String orderNumber);
}