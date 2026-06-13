package com.example.commerza.category.dto;


import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private boolean active;
    private String message;
}
