package com.example.commerza.user.controller;
import com.example.commerza.user.dto.*;
import com.example.commerza.user.passwordreset.dto.*;
import com.example.commerza.user.refreshtoken.dto.RefreshRequest;
import com.example.commerza.user.refreshtoken.dto.RefreshResponse;
import com.example.commerza.user.refreshtoken.service.RefreshTokenService;
import com.example.commerza.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public UserController(UserService userService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/api/v1/auth/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest request){
        return userService.getRegister(request);
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request){
        return userService.getLogin(request);
    }

    @PostMapping("/api/v1/auth/refresh-token")
    public RefreshResponse refreshTokens(@RequestBody RefreshRequest request){
        return refreshTokenService.refresh(request);
    }

    @PostMapping("/api/v1/auth/logout")
    public ResponseEntity<LogoutResponse> logout(@RequestBody LogoutRequest request){
        return userService.logout(request);
    }

    @PostMapping("/api/v1/auth/forget-password")
    public ResponseEntity<ResetResponse> reset(@RequestBody ResetRequest request){

        return userService.reset(request);
    }

    @PostMapping("/api/v1/auth/verify-otp")
    public ResponseEntity<VerifyResponse> verifyResponse(@RequestBody VerifyRequest request){
        return userService.verifyResponse(request);
    }

    @PostMapping("/api/v1/auth/reset-password")
    public ResponseEntity<PasswordResponse> resetPassword(@RequestBody PasswordRequest request){
        return userService.resetPassword(request);
    }

    @PostMapping("/api/v1/orders")
    public String test(){
        return "Authenticated";
    }


    @PostMapping("/api/v1/admin")
    public String test2(){
        return "Authenticated";
    }

}
