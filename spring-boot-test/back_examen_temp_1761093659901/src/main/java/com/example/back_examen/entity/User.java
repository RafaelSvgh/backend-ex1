package com.example.back_examen.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String id;
    private String name;
    private String email;
    private String createdAt;

    @OneToMany(mappedBy = "user")
    private List<Post> posts = new ArrayList<>();
}