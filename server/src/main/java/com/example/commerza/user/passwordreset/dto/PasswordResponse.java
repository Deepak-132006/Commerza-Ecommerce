package com.example.commerza.user.passwordreset.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PasswordResponse {
    private boolean success;
    private String message;
}
