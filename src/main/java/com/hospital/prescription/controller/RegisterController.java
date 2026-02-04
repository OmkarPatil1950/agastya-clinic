package com.hospital.prescription.controller;

import com.hospital.prescription.dto.DoctorLoginDto;
import com.hospital.prescription.dto.UpdatePasswordDto;
import com.hospital.prescription.model.DoctorDetails;
import com.hospital.prescription.service.RegisterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:80", "http://localhost"})
public class RegisterController {

    private final RegisterService RegisterService;

    @Autowired
    public RegisterController(RegisterService RegisterService) {
        this.RegisterService = RegisterService;
    }

    // ------------------ Register Doctor ------------------
    @PostMapping("/register")
    public ResponseEntity<DoctorDetails> registerDoctor(@RequestBody DoctorDetails doctor) {

    	System.out.println(doctor);
        // Check if email already exists
        if (RegisterService.getDoctorByEmail(doctor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(null);
        }

        DoctorDetails savedDoctor = RegisterService.saveDoctor(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @PostMapping("/login")
    public ResponseEntity<DoctorDetails> login( @RequestBody DoctorLoginDto loginDto) {
    	System.out.print("register controller");
        return ResponseEntity.ok(RegisterService.login(loginDto));
    }

    
    // ------------------ Get All Doctors ------------------
    @GetMapping("/all")
    public ResponseEntity<List<DoctorDetails>> getAllDoctors() {
        return ResponseEntity.ok(RegisterService.getAllDoctors());
    }

    // ------------------ Get Doctor by ID ------------------
    @GetMapping("/find/{id}")
    public ResponseEntity<DoctorDetails> getDoctorById(@PathVariable Long id) {
        return RegisterService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------ Update Doctor ------------------
    @PutMapping("/update-password")
    public ResponseEntity<DoctorDetails> updatePassword(
            @RequestBody @Valid UpdatePasswordDto dto) {

        return ResponseEntity.ok(RegisterService.updatePassword(dto));
    }

    // ------------------ Delete Doctor ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        RegisterService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }
}
