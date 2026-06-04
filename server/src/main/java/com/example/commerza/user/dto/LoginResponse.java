package com.example.commerza.user.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;
}
