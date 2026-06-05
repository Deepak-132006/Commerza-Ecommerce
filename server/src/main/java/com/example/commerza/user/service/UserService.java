package com.example.commerza.user.service;

import com.example.commerza.user.dto.LoginRequest;
import com.example.commerza.user.dto.LoginResponse;
import com.example.commerza.user.dto.RegisterRequest;
import com.example.commerza.user.dto.RegisterResponse;
import com.example.commerza.user.entity.Role;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.repository.UserRespository;
import com.example.commerza.user.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRespository userRespository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private UserService(UserRespository userRespository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRespository = userRespository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    public RegisterResponse getRegister(RegisterRequest request) {
        if(request.getName().isBlank() || request.getEmail().isBlank() || request.getPassword().isBlank()){
            return RegisterResponse.builder().message("Every fields are required !!").build();
        }
        if(userRespository.existsByEmail(request.getEmail())){
            return RegisterResponse.builder().message("User already exists").build();
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        User savedUser = userRespository.save(user);

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .message("User registered successfully").build();
    }

    public LoginResponse getLogin(LoginRequest request) {
        User user = userRespository.findByEmail(request.getEmail());
        LoginResponse response = new LoginResponse();
        if (user == null){
            response.setMessage("Invalid Credentials");
            return response;
        }
        String storedPassed = user.getPassword();
        boolean matches = passwordEncoder.matches(request.getPassword(), storedPassed);
        if(matches){
            response.setMessage("Login successful");
            response.setId(user.getId());
            response.setEmail(user.getEmail());
            response.setRole(String.valueOf(user.getRole()));
            response.setName(user.getName());
            response.setToken(jwtUtil.generateToken(user.getEmail()));
        } else {
            response.setMessage("Invalid Credentials");
        }
        return response;
    }
}
