package com.example.back_examen.controller;

import com.example.back_examen.entity.User;
import com.example.back_examen.dto.CreateUserDto;
import com.example.back_examen.dto.UpdateUserDto;
import com.example.back_examen.dto.UserResponseDto;
import com.example.back_examen.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> findAll() {
        List<User> users = userService.findAll();
        List<UserResponseDto> response = users.stream()
            .map(UserResponseDto::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> findById(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user != null) {
            return ResponseEntity.ok(new UserResponseDto(user));
        }
        return ResponseEntity.notFound().build();
    }

    // POST create new user
    @PostMapping
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody CreateUserDto createDto) {
        User savedUser = userService.create(createDto);
        return ResponseEntity.ok(new UserResponseDto(savedUser));
    }

    // PUT update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(@PathVariable Long id, @RequestBody UpdateUserDto updateDto) {
        User updatedUser = userService.update(id, updateDto);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new UserResponseDto(updatedUser));
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        userService.deleteById(id);
        return ResponseEntity.ok("User with id " + id + " deleted successfully.");
    }
}
