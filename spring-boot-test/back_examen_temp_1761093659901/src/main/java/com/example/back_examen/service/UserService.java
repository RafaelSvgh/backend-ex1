package com.example.back_examen.service;

import com.example.back_examen.entity.User;
import com.example.back_examen.dto.CreateUserDto;
import com.example.back_examen.dto.UpdateUserDto;
import com.example.back_examen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    // Crear entidad usando DTO
    public User create(CreateUserDto createDto) {
        User user = new User();
        
        // Mapear atributos básicos
        user.setId(createDto.getId());
        user.setName(createDto.getName());
        user.setEmail(createDto.getEmail());
        user.setCreatedAt(createDto.getCreatedAt());
        
        return userRepository.save(user);
    }

    // Actualizar entidad usando DTO
    public User update(Long id, UpdateUserDto updateDto) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }
        
        // Actualizar atributos si no son null
        if (updateDto.getId() != null) {
            existingUser.setId(updateDto.getId());
        }
        if (updateDto.getName() != null) {
            existingUser.setName(updateDto.getName());
        }
        if (updateDto.getEmail() != null) {
            existingUser.setEmail(updateDto.getEmail());
        }
        if (updateDto.getCreatedAt() != null) {
            existingUser.setCreatedAt(updateDto.getCreatedAt());
        }
        
        return userRepository.save(existingUser);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    // Método legacy para compatibilidad
    public User save(User user) {
        return userRepository.save(user);
    }
}
