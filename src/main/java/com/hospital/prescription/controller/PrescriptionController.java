package com.hospital.prescription.controller;

import com.hospital.prescription.dto.PrescriptionDTO;
import com.hospital.prescription.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:80", "http://localhost"})
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<PrescriptionDTO> createPrescription(@Valid @RequestBody PrescriptionDTO prescriptionDTO) {
    	System.out.print(prescriptionDTO.toString());
        return new ResponseEntity<>(prescriptionService.createPrescription(prescriptionDTO), HttpStatus.CREATED);
    }

    @GetMapping("/api/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable Long id) {
    	System.out.print("-------------id-----------"+id+"--------");
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }

    @GetMapping("/prescriptionId/{prescriptionId}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionByPrescriptionId(@PathVariable String prescriptionId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionByPrescriptionId(prescriptionId));
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(@PathVariable Long id, @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        return ResponseEntity.ok(prescriptionService.updatePrescription(id, prescriptionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search/date-range")
    public ResponseEntity<List<PrescriptionDTO>> searchPrescriptionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(prescriptionService.searchPrescriptions(null, startDate, endDate));
    }
    
    @GetMapping("/search/patient/{patientId}/date-range")
    public ResponseEntity<List<PrescriptionDTO>> searchPrescriptionsByPatientAndDateRange(
            @PathVariable Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(prescriptionService.searchPrescriptions(patientId, startDate, endDate));
    }
    
    @GetMapping("/search/patient/{patientId}/older-than/{years}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsOlderThanYears(
            @PathVariable Long patientId,
            @PathVariable int years) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsOlderThanYears(patientId, years));
    }
}