package com.example.commerza.user.repository;

import com.example.commerza.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
