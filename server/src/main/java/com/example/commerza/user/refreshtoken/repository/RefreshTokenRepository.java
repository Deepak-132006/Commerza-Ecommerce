package com.example.commerza.user.refreshtoken.repository;


import com.example.commerza.user.refreshtoken.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository <RefreshToken, Long>{
    Optional<RefreshToken> findByUser_Id(Long id);
    Optional<RefreshToken> findByToken(String token);
    boolean existsByToken(String token);
    void deleteByUser_Id(Long id);
}
