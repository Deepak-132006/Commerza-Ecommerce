package com.example.commerza.user.refreshtoken.dto;


import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshResponse {
    private String success;
    private String message;
    private String accessToken;
}
