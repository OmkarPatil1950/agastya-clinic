package com.hospital.prescription.service;

import com.hospital.prescription.dto.PatientDTO;
import java.util.List;

import javax.validation.Valid;

public interface PatientService {
    PatientDTO getPatientById(Long id);
    PatientDTO getPatientByPatientId(String patientId);
    List<PatientDTO> getAllPatients();
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    void deletePatient(Long id);
	List<PatientDTO> getPatientsByDoctorId(Long doctorId);
	List<PatientDTO> createPatients(List<PatientDTO> patientDTOs);
	Object createSinglePatient(@Valid PatientDTO patientDTO);
}