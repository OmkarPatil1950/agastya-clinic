package com.hospital.prescription.controller;

import com.hospital.prescription.dto.PatientDTO;
import com.hospital.prescription.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:80", "http://localhost"})
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/all")
    public ResponseEntity<List<PatientDTO>> createPatient(@Valid @RequestBody List<PatientDTO> patientDTO) {
        return new ResponseEntity<>(patientService.createPatients(patientDTO), HttpStatus.CREATED);
    }
    
    @PostMapping
    public ResponseEntity<PatientDTO> createSinglePatient(@Valid @RequestBody PatientDTO patientDTO) {
        PatientDTO savedPatient = (PatientDTO) patientService.createSinglePatient(patientDTO);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }
    @GetMapping("/getBydocId/{id}")
    public ResponseEntity<List<PatientDTO>> getPatientByDocId(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientsByDoctorId(id));
    }

    @GetMapping("/code/{patientId}")
    public ResponseEntity<PatientDTO> getPatientByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientByPatientId(patientId));
    }

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @Valid @RequestBody PatientDTO patientDTO) {
        return ResponseEntity.ok(patientService.updatePatient(id, patientDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}