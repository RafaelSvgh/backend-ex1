package com.example.back_examen.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String id;
    private String name;
    private String email;
    private String createdAt;
    private List<Long> postIds;

    // Constructor para mapear desde Entity
    public UserResponseDto(User user) {
        this.id = user.getId();
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        if (user.getPosts() != null) {
            this.postIds = user.getPosts().stream()
                .map(item -> item.getId())
                .collect(java.util.stream.Collectors.toList());
        }
    }

    // Constructor vacío
    public UserResponseDto() {}
}
