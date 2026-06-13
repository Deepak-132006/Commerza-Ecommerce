package com.example.commerza.category.dto;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateCategoryRequest {

    @NotNull
    private String name;
    private String description;

    private String message;
}
