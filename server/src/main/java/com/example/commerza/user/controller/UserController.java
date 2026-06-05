package com.example.commerza.user.controller;
import com.example.commerza.user.dto.LoginRequest;
import com.example.commerza.user.dto.LoginResponse;
import com.example.commerza.user.dto.RegisterRequest;
import com.example.commerza.user.dto.RegisterResponse;
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

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/v1/auth/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest request){
        RegisterResponse response = userService.getRegister(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request){
        LoginResponse response = userService.getLogin(request);

        return ResponseEntity.ok(response);
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
