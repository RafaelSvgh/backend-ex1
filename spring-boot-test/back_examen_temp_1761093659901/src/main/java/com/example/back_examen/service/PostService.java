package com.example.back_examen.service;

import com.example.back_examen.entity.Post;
import com.example.back_examen.dto.CreatePostDto;
import com.example.back_examen.dto.UpdatePostDto;
import com.example.back_examen.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.example.back_examen.service.UserService;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;

    public Post findById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    // Crear entidad usando DTO
    public Post create(CreatePostDto createDto) {
        Post post = new Post();
        
        // Mapear atributos básicos
        post.setId(createDto.getId());
        post.setTitle(createDto.getTitle());
        post.setContent(createDto.getContent());
        post.setPublishedAt(createDto.getPublishedAt());
        
        // Establecer relación con User
        if (createDto.getUserId() != null) {
            User user = userService.findById(createDto.getUserId());
            if (user != null) {
                post.setUser(user);
            }
        }
        
        return postRepository.save(post);
    }

    // Actualizar entidad usando DTO
    public Post update(Long id, UpdatePostDto updateDto) {
        Post existingPost = postRepository.findById(id).orElse(null);
        if (existingPost == null) {
            return null;
        }
        
        // Actualizar atributos si no son null
        if (updateDto.getId() != null) {
            existingPost.setId(updateDto.getId());
        }
        if (updateDto.getTitle() != null) {
            existingPost.setTitle(updateDto.getTitle());
        }
        if (updateDto.getContent() != null) {
            existingPost.setContent(updateDto.getContent());
        }
        if (updateDto.getPublishedAt() != null) {
            existingPost.setPublishedAt(updateDto.getPublishedAt());
        }
        
        // Actualizar relación con User
        if (updateDto.getUserId() != null) {
            User user = userService.findById(updateDto.getUserId());
            if (user != null) {
                existingPost.setUser(user);
            }
        }
        
        return postRepository.save(existingPost);
    }

    public void deleteById(Long id) {
        postRepository.deleteById(id);
    }

    // Método legacy para compatibilidad
    public Post save(Post post) {
        return postRepository.save(post);
    }
}
