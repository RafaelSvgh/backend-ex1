package com.example.back_examen.dto;

import lombok.Data;

@Data
public class UpdateUserDto {
    private String id;
    private String name;
    private String email;
    private String createdAt;
}
