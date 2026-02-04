package com.hospital.prescription.service;

import com.hospital.prescription.dto.PrescriptionDTO;
import java.time.LocalDate;
import java.util.List;

public interface PrescriptionService {
    PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO);
    PrescriptionDTO getPrescriptionById(Long id);
    PrescriptionDTO getPrescriptionByPrescriptionId(String prescriptionId);
    List<PrescriptionDTO> getAllPrescriptions();
    List<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId);
    List<PrescriptionDTO> searchPrescriptions(Long patientId, LocalDate from, LocalDate to);
    List<PrescriptionDTO> getPrescriptionsOlderThanYears(Long patientId, int years);
    PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO);
    void deletePrescription(Long id);
}