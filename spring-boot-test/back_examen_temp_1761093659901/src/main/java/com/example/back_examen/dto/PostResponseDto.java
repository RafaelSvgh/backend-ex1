package com.example.back_examen.dto;

import lombok.Data;

@Data
public class PostResponseDto {
    private Long id;
    private String id;
    private String title;
    private String content;
    private String publishedAt;
    private Long userId;
    private UserResponseDto user;

    // Constructor para mapear desde Entity
    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.publishedAt = post.getPublishedAt();
        if (post.getUser() != null) {
            this.userId = post.getUser().getId();
            // Opcional: mapear objeto completo (cuidado con recursión)
            // this.user = new UserResponseDto(post.getUser());
        }
    }

    // Constructor vacío
    public PostResponseDto() {}
}
