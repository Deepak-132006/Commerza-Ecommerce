package com.example.commerza.user.service;

import com.example.commerza.user.dto.*;
import com.example.commerza.user.entity.Role;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.passwordreset.dto.*;
import com.example.commerza.user.passwordreset.entity.PasswordReset;
import com.example.commerza.user.passwordreset.repository.ResetPassRepository;
import com.example.commerza.user.passwordreset.util.OtpUtil;
import com.example.commerza.user.refreshtoken.entity.RefreshToken;
import com.example.commerza.user.refreshtoken.repository.RefreshTokenRepository;
import com.example.commerza.user.refreshtoken.util.RefreshTokenUtil;
import com.example.commerza.user.repository.UserRespository;
import com.example.commerza.user.security.JwtUtil;
import org.springframework.http.ResponseEntity;
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
    private final OtpUtil otpUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ResetPassRepository resetPassRepository;
    private final EmailService emailService;

    public UserService(UserRespository userRespository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenUtil refreshTokenUtil, OtpUtil otpUtil, RefreshTokenRepository refreshTokenRepository, ResetPassRepository resetPassRepository, EmailService emailService) {
        this.userRespository = userRespository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenUtil = refreshTokenUtil;
        this.otpUtil = otpUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.resetPassRepository = resetPassRepository;
        this.emailService = emailService;
    }


    public ResponseEntity<RegisterResponse> getRegister(RegisterRequest request) {
        if (request.getName().isBlank() || request.getEmail().isBlank() || request.getPassword().isBlank()) {
            RegisterResponse response = RegisterResponse.builder().message("Every fields are required !!").build();
            return ResponseEntity.badRequest().body(response);
        }
        if (userRespository.existsByEmail(request.getEmail())) {
            RegisterResponse response = RegisterResponse.builder().message("User already exists").build();
            return ResponseEntity.badRequest().body(response);
        }
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(Role.USER).isActive(true).createdAt(LocalDateTime.now()).build();
        User savedUser = userRespository.save(user);

        RegisterResponse response = RegisterResponse.builder().id(savedUser.getId()).name(savedUser.getName()).email(savedUser.getEmail()).role(savedUser.getRole()).createdAt(savedUser.getCreatedAt()).message("User registered successfully").build();
        return ResponseEntity.ok(response);

    }

    public ResponseEntity<LoginResponse> getLogin(LoginRequest request) {

        User user = userRespository.findByEmail(request.getEmail());
        LoginResponse response = new LoginResponse();

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.setMessage("Invalid Credentials");
            return ResponseEntity.status(401).body(response);
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
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<LogoutResponse> logout(LogoutRequest request) {

        String refreshToken = request.getRefreshToken();
        Optional<RefreshToken> refreshTokenEntity = refreshTokenRepository.findByToken(refreshToken);
        LogoutResponse response = new LogoutResponse();
        System.out.println("Incoming token = " + refreshToken);
        System.out.println(refreshTokenRepository.findAll());
        if (refreshTokenEntity.isEmpty()) {
            response.setMessage("Token not Found");
            return ResponseEntity.status(404).body(response);
        }

        RefreshToken token = refreshTokenEntity.get();
        if (token.isRevoked()) {
            response.setMessage("User already logged out");
            return ResponseEntity.status(404).body(response);
        }
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        response.setMessage("Logout Success");

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<ResetResponse> reset(ResetRequest request) {
        System.out.println("API RECEIVED - SERVICE");
        User user = userRespository.findByEmail(request.getEmail());

        if (user != null) {
            String otp = otpUtil.generateOtp();

            PasswordReset passwordReset = PasswordReset.builder().email(user.getEmail()).otp(otp).expiryTime(LocalDateTime.now().plusMinutes(10)).used(false).build();

            resetPassRepository.save(passwordReset);
            emailService.sendOtp(request.getEmail(), otp);
        }

        ResetResponse response = ResetResponse.builder().message("If user exist, OTP is sent").build();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<VerifyResponse> verifyResponse(VerifyRequest request) {
        PasswordReset passwordResetEntity = resetPassRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail());
        if (passwordResetEntity == null) {
            VerifyResponse response = VerifyResponse.builder().success(false).message("Invalid OTP or Email").build();
            return ResponseEntity.status(404).body(response);
        }

        if (passwordResetEntity.isUsed()) {
            VerifyResponse response = VerifyResponse.builder().success(false).message("OTP already used").build();
            return ResponseEntity.badRequest().body(response);
        }

        if (passwordResetEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            VerifyResponse response = VerifyResponse.builder().success(false).message("OTP Expired").build();
            return ResponseEntity.badRequest().body(response);
        }
        if (!request.getOtp().equals(passwordResetEntity.getOtp())) {

            VerifyResponse response = VerifyResponse.builder().success(false).message("Invalid OTP").build();
            return ResponseEntity.badRequest().body(response);

        }

        VerifyResponse response = VerifyResponse.builder().success(true).message("OTP verified successfully").build();
        return ResponseEntity.ok(response);

    }

    public ResponseEntity<PasswordResponse> resetPassword(PasswordRequest request) {
        PasswordReset passwordReset = resetPassRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail());

        if (passwordReset == null) {
            PasswordResponse response = PasswordResponse.builder().message("No User found").success(false).build();
            return ResponseEntity.status(404).body(response);
        }
        if (passwordReset.getOtp() == null) {
            PasswordResponse response = PasswordResponse.builder().message("Invalid OTP").success(false).build();
            return ResponseEntity.badRequest().body(response);

        }

        if (passwordReset.isUsed()) {
            PasswordResponse response = PasswordResponse.builder().message("OTP already used").success(false).build();
            return ResponseEntity.badRequest().body(response);

        }

        if (passwordReset.getExpiryTime().isBefore(LocalDateTime.now())) {

            PasswordResponse response = PasswordResponse.builder().message("OTP Expired").success(false).build();
            return ResponseEntity.badRequest().body(response);

        }
        if (!request.getOtp().equals(passwordReset.getOtp())) {

            PasswordResponse response = PasswordResponse.builder().message("Invalid OTP").success(false).build();
            return ResponseEntity.badRequest().body(response);

        }
        String newPassword = passwordEncoder.encode(request.getNewPassword());
        User user = userRespository.findByEmail(request.getEmail());
        user.setPassword(newPassword);
        passwordReset.setUsed(true);
        resetPassRepository.save(passwordReset);
        userRespository.save(user);


        PasswordResponse response = PasswordResponse.builder().success(true).message("Password reset successful").build();
        return ResponseEntity.ok(response);

    }
}
