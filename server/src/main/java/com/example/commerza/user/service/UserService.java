package com.example.commerza.user.service;

import com.example.commerza.user.dto.*;
import com.example.commerza.user.entity.Role;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.refreshtoken.entity.RefreshToken;
import com.example.commerza.user.refreshtoken.repository.RefreshTokenRepository;
import com.example.commerza.user.refreshtoken.util.RefreshTokenUtil;
import com.example.commerza.user.repository.UserRespository;
import com.example.commerza.user.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRespository userRespository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenUtil refreshTokenUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    private UserService(UserRespository userRespository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenUtil refreshTokenUtil, RefreshTokenRepository refreshTokenRepository) {
        this.userRespository = userRespository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenUtil = refreshTokenUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }


    public RegisterResponse getRegister(RegisterRequest request) {
        if (request.getName().isBlank() || request.getEmail().isBlank() || request.getPassword().isBlank()) {
            return RegisterResponse.builder().message("Every fields are required !!").build();
        }
        if (userRespository.existsByEmail(request.getEmail())) {
            return RegisterResponse.builder().message("User already exists").build();
        }
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(Role.USER).isActive(true).createdAt(LocalDateTime.now()).build();
        User savedUser = userRespository.save(user);

        return RegisterResponse.builder().id(savedUser.getId()).name(savedUser.getName()).email(savedUser.getEmail()).role(savedUser.getRole()).createdAt(savedUser.getCreatedAt()).message("User registered successfully").build();
    }

    public LoginResponse getLogin(LoginRequest request) {

        User user = userRespository.findByEmail(request.getEmail());
        LoginResponse response = new LoginResponse();

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.setMessage("Invalid Credentials");
            return response;
        }

        response.setMessage("Login successful");
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(String.valueOf(user.getRole()));
        response.setName(user.getName());

        response.setAccessToken(jwtUtil.generateToken(user.getEmail()));
        String refreshToken = refreshTokenUtil.generateRefreshToken(user.getEmail());
        response.setRefreshToken(refreshToken);

        Optional<RefreshToken> refreshTokenEntity = refreshTokenRepository.findByUser_Id(user.getId());
        RefreshToken entity = refreshTokenEntity.orElse(new RefreshToken());
        entity.setUser(user);
        entity.setToken(refreshToken);
        entity.setExpiryDate(LocalDateTime.now().plusDays(7));
        entity.setRevoked(false);

        refreshTokenRepository.save(entity);
        return response;
    }

    public LogoutResponse logout(LogoutRequest request) {
        String refreshToken = request.getRefreshToken();
        Optional<RefreshToken> refreshTokenEntity = refreshTokenRepository.findByToken(refreshToken);
        LogoutResponse response = new LogoutResponse();
        System.out.println("Incoming token = " + refreshToken);
        System.out.println(refreshTokenRepository.findAll());
        if (refreshTokenEntity.isEmpty()) {
            response.setMessage("Token not Found");
            return response;
        }

        RefreshToken token = refreshTokenEntity.get();
        if (token.isRevoked()) {
            response.setMessage("User already logged out");
            return response;
        }
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        response.setMessage("Logout Success");

        return response;
    }
}
