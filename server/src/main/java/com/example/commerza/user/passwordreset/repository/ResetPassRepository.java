package com.example.commerza.user.passwordreset.repository;

import com.example.commerza.user.passwordreset.dto.ResetRequest;
import com.example.commerza.user.passwordreset.dto.ResetResponse;
import com.example.commerza.user.passwordreset.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetPassRepository extends JpaRepository<PasswordReset, Long> {
    PasswordReset findTopByEmailOrderByCreatedAtDesc(String email);
}
