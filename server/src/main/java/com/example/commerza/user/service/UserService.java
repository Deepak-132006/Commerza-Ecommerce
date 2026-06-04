package com.example.commerza.user.service;

import com.example.commerza.user.dto.LoginRequest;
import com.example.commerza.user.dto.LoginResponse;
import com.example.commerza.user.dto.RegisterRequest;
import com.example.commerza.user.dto.RegisterResponse;
import com.example.commerza.user.entity.Role;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.repository.UserRespository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRespository userRespository;
    private final BCryptPasswordEncoder passwordEncoder;
    private UserService(UserRespository userRespository, BCryptPasswordEncoder passwordEncoder) {
        this.userRespository = userRespository;
        this.passwordEncoder = passwordEncoder;
    }


    public RegisterResponse getRegister(RegisterRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User saveduser = userRespository.save(user);

        return RegisterResponse.builder()
                .id(saveduser.getId())
                .name(saveduser.getName())
                .email(saveduser.getEmail())
                .role(saveduser.getRole())
                .createdAt(saveduser.getCreatedAt())
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
        } else {
            response.setMessage("Invalid Credentials");
        }
        return response;
    }
}
