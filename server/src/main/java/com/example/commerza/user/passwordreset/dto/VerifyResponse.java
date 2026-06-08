package com.example.commerza.user.passwordreset.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyResponse {

    private Boolean success;

    @NotNull
    private String message;
}
