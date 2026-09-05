package com.example.commerza.user.refreshtoken.service;

import com.example.commerza.user.entity.User;
import com.example.commerza.user.refreshtoken.dto.RefreshRequest;
import com.example.commerza.user.refreshtoken.dto.RefreshResponse;
import com.example.commerza.user.refreshtoken.entity.RefreshToken;
import com.example.commerza.user.refreshtoken.repository.RefreshTokenRepository;
import com.example.commerza.user.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.ref.Reference;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    public ResponseEntity<RefreshResponse> refresh(RefreshRequest request) {

        String refreshToken = request.getRefreshToken();

        Optional<RefreshToken> refreshEntity =
                refreshTokenRepository.findByToken(refreshToken);

        // Refresh token doesn't exist
        if (refreshEntity.isEmpty()) {

            RefreshResponse response = new RefreshResponse();
            response.setMessage("Refresh token not found");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        RefreshToken token = refreshEntity.get();

        // Refresh token revoked
        if (token.isRevoked()) {

            RefreshResponse response = new RefreshResponse();
            response.setMessage("Refresh token revoked");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Refresh token expired
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {

            RefreshResponse response = new RefreshResponse();
            response.setMessage("Refresh token expired");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Everything is valid
        User user = token.getUser();

        RefreshResponse response = new RefreshResponse();

        response.setAccessToken(
                jwtUtil.generateToken(user.getEmail())
        );

        response.setSuccess("Access Token generated");

        return ResponseEntity.ok(response);
    }
}
