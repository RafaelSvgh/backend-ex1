package com.example.back_examen.controller;

import com.example.back_examen.entity.Post;
import com.example.back_examen.dto.CreatePostDto;
import com.example.back_examen.dto.UpdatePostDto;
import com.example.back_examen.dto.PostResponseDto;
import com.example.back_examen.service.PostService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // GET all posts
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> findAll() {
        List<Post> posts = postService.findAll();
        List<PostResponseDto> response = posts.stream()
            .map(PostResponseDto::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // GET post by ID
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> findById(@PathVariable Long id) {
        Post post = postService.findById(id);
        if (post != null) {
            return ResponseEntity.ok(new PostResponseDto(post));
        }
        return ResponseEntity.notFound().build();
    }

    // POST create new post
    @PostMapping
    public ResponseEntity<PostResponseDto> create(@Valid @RequestBody CreatePostDto createDto) {
        Post savedPost = postService.create(createDto);
        return ResponseEntity.ok(new PostResponseDto(savedPost));
    }

    // PUT update post
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> update(@PathVariable Long id, @RequestBody UpdatePostDto updateDto) {
        Post updatedPost = postService.update(id, updateDto);
        if (updatedPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PostResponseDto(updatedPost));
    }

    // DELETE post
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Post post = postService.findById(id);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        
        postService.deleteById(id);
        return ResponseEntity.ok("Post with id " + id + " deleted successfully.");
    }
}
