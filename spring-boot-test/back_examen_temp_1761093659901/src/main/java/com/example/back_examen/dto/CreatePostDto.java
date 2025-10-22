package com.example.back_examen.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class CreatePostDto {
    @NotBlank(message = "id is required")
    private String id;

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "content is required")
    private String content;

    @NotBlank(message = "publishedAt is required")
    private String publishedAt;

    @NotNull(message = "User ID is required")
    private Long userId;

}
