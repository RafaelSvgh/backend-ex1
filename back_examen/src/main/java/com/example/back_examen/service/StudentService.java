package com.example.back_examen.service;

import com.example.back_examen.entity.Student;
import com.example.back_examen.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student findById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }

    public Student update(Long id,Student student) {
        return studentRepository.save(student);
    }


}
