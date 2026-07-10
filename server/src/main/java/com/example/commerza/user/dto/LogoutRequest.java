package com.example.commerza.user.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogoutRequest {
    private String refreshToken;
}
