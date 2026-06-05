package com.example.commerza.user.refreshtoken.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RefreshRequest {
    private String refreshToken;
}
