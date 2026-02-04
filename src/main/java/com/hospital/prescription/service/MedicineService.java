package com.hospital.prescription.service;

import com.hospital.prescription.dto.MedicineDTO;
import java.util.List;

public interface MedicineService {
    MedicineDTO createMedicine(MedicineDTO medicineDTO);
    MedicineDTO getMedicineById(Long id);
    MedicineDTO getMedicineByName(String name);
    List<MedicineDTO> getAllMedicines();
    List<MedicineDTO> getAllActiveMedicines();
    MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO);
    void deleteMedicine(Long id);
}