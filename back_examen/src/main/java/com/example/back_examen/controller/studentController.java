package com.example.back_examen.controller;

import com.example.back_examen.entity.Student;
import com.example.back_examen.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/students")
public class studentController {

    private final StudentService studentService;

    public studentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET all students
    @GetMapping
    public List<Student> findAll() {
        return studentService.findAll();
    }

    // GET student by ID
    @GetMapping("/{id}")
    public Student findById(@PathVariable Long id) {
        return studentService.findById(id);
    }

    // POST create new student
    @PostMapping
    public Student create(@RequestBody Student student) {
        return studentService.save(student);
    }

    // PUT update student
    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student studentDetails) {
        return studentService.update(id, studentDetails);
    }

    // DELETE student
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        studentService.deleteById(id);
        return "Student with id " + id + " deleted successfully.";
    }

}
