package com.hospital.prescription.controller;

import com.hospital.prescription.dto.MedicineDTO;
import com.hospital.prescription.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(@Valid @RequestBody MedicineDTO medicineDTO) {
        return new ResponseEntity<>(medicineService.createMedicine(medicineDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<MedicineDTO> getMedicineByName(@PathVariable String name) {
        return ResponseEntity.ok(medicineService.getMedicineByName(name));
    }

    @GetMapping
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/active")
    public ResponseEntity<List<MedicineDTO>> getAllActiveMedicines() {
        return ResponseEntity.ok(medicineService.getAllActiveMedicines());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Long id, @Valid @RequestBody MedicineDTO medicineDTO) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, medicineDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
