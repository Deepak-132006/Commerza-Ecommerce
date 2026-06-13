package com.example.commerza.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CreateCategoryRequest {
    @NotBlank
    @NotNull
    private String name;
    private String description;
}
