package com.hospital.prescription.service.impl;

import com.hospital.prescription.dto.MedicineDTO;
import com.hospital.prescription.model.Medicine;
import com.hospital.prescription.repository.MedicineRepository;
import com.hospital.prescription.service.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @Override
    public MedicineDTO createMedicine(MedicineDTO medicineDTO) {
        if (medicineDTO.getName() == null || medicineDTO.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medicine name is required");
        }

        if (medicineRepository.existsByName(medicineDTO.getName().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medicine with the given name already exists");
        }

        Medicine medicine = new Medicine();
        copyDtoToEntity(medicineDTO, medicine);
        Medicine saved = medicineRepository.save(medicine);
        return toDto(saved);
    }

    @Override
    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));
        return toDto(medicine);
    }

    @Override
    public MedicineDTO getMedicineByName(String name) {
        Medicine medicine = medicineRepository.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));
        return toDto(medicine);
    }

    @Override
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineDTO> getAllActiveMedicines() {
        return medicineRepository.findByIsActiveTrue()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));

        // Handle name uniqueness if changed
        if (medicineDTO.getName() != null) {
            String newName = medicineDTO.getName().trim();
            if (!newName.equalsIgnoreCase(existing.getName()) && medicineRepository.existsByName(newName)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medicine with the given name already exists");
            }
            existing.setName(newName);
        }

        // Update other fields when provided
        if (medicineDTO.getDescription() != null) existing.setDescription(medicineDTO.getDescription());
        if (medicineDTO.getManufacturer() != null) existing.setManufacturer(medicineDTO.getManufacturer());
        if (medicineDTO.getCategory() != null) existing.setCategory(medicineDTO.getCategory());
        if (medicineDTO.getIsActive() != null) existing.setIsActive(medicineDTO.getIsActive());

        Medicine saved = medicineRepository.save(existing);
        return toDto(saved);
    }

    @Override
    public void deleteMedicine(Long id) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));
        medicineRepository.delete(existing);
    }

    private MedicineDTO toDto(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setDescription(medicine.getDescription());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setCategory(medicine.getCategory());
        dto.setIsActive(medicine.getIsActive());
        return dto;
    }

    private void copyDtoToEntity(MedicineDTO dto, Medicine entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setManufacturer(dto.getManufacturer());
        entity.setCategory(dto.getCategory());
        entity.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : Boolean.TRUE);
    }
}