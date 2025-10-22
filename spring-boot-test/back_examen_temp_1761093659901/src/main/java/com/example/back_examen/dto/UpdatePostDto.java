package com.example.back_examen.dto;

import lombok.Data;

@Data
public class UpdatePostDto {
    private String id;
    private String title;
    private String content;
    private String publishedAt;
    private Long userId;
}
