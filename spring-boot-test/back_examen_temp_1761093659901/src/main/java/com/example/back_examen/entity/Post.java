package com.example.back_examen.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String id;
    private String title;
    private String content;
    private String publishedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}