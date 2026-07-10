package com.example.commerza.user.refreshtoken.service;

import com.example.commerza.user.entity.User;
import com.example.commerza.user.refreshtoken.dto.RefreshRequest;
import com.example.commerza.user.refreshtoken.dto.RefreshResponse;
import com.example.commerza.user.refreshtoken.entity.RefreshToken;
import com.example.commerza.user.refreshtoken.repository.RefreshTokenRepository;
import com.example.commerza.user.security.JwtUtil;
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

    public RefreshResponse refresh(RefreshRequest request){
        String refreshToken = request.getRefreshToken();
        RefreshResponse response = new RefreshResponse();
        Optional<RefreshToken> refreshEntity = refreshTokenRepository.findByToken(refreshToken);

        if(refreshEntity.isEmpty()){
            response.setMessage("Refresh token not found");
            return response;
        }

        RefreshToken token = refreshEntity.get();

        if(token.isRevoked()){
            response.setMessage("Refresh token revoked");
            return response;
        }
        if(token.getExpiryDate().isBefore(LocalDateTime.now())){
            response.setMessage("Refresh token expired");
            return response;
        }
        User user = token.getUser();
        response.setAccessToken(jwtUtil.generateToken(user.getEmail()));
        response.setSuccess("Refresh Token generated");

        return response;
    }
}
