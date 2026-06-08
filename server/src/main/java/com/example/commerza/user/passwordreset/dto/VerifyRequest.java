package com.example.commerza.user.passwordreset.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class VerifyRequest {

    @Email
    @NotNull
    private String email;

    @NotNull
    private String otp;
}
