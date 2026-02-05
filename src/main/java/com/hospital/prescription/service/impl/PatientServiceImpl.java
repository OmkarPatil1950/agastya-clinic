package com.hospital.prescription.service.impl;

import com.hospital.prescription.dto.PatientDTO;
import com.hospital.prescription.model.DoctorDetails;
import com.hospital.prescription.model.Patient;
import com.hospital.prescription.repository.DoctorRepository;
import com.hospital.prescription.repository.PatientRepository;
import com.hospital.prescription.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    
    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public List<PatientDTO> createPatients(List<PatientDTO> patientDTOs) {
        List<Patient> patients = patientDTOs.stream().map(dto -> {
            Patient patient = new Patient();
            copyDtoToEntity(dto, patient);
            return patient;
        }).collect(Collectors.toList());

        List<Patient> savedPatients = patientRepository.saveAll(patients);
        return savedPatients.stream().map(this::toDto).collect(Collectors.toList());
    }



    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        return toDto(patient);
    }

    @Override
    public PatientDTO getPatientByPatientId(String patientId) {
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        return toDto(patient);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        if (patientDTO.getPatientId() != null) {
            String newCode = patientDTO.getPatientId().trim();
            if (existing.getPatientId() == null || !newCode.equalsIgnoreCase(existing.getPatientId())) {
                if (patientRepository.existsByPatientId(newCode)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient with the given ID already exists");
                }
                existing.setPatientId(newCode);
            }
        }

        // Update other fields when provided
        if (patientDTO.getFirstName() != null) existing.setFirstName(patientDTO.getFirstName());
        if (patientDTO.getLastName() != null) existing.setLastName(patientDTO.getLastName());
        if (patientDTO.getGender() != null) existing.setGender(patientDTO.getGender());
        if (patientDTO.getDateOfBirth() != null) {
            existing.setDateOfBirth(patientDTO.getDateOfBirth());
            existing.setAge(java.time.Period.between(patientDTO.getDateOfBirth(), java.time.LocalDate.now()).getYears());
        }
        if (patientDTO.getContactNumber() != null) existing.setContactNumber(patientDTO.getContactNumber());
        if (patientDTO.getEmail() != null) existing.setEmail(patientDTO.getEmail());
        if (patientDTO.getAddress() != null) existing.setAddress(patientDTO.getAddress());

        Patient saved = patientRepository.save(existing);
        return toDto(saved);
    }

    @Override
    public void deletePatient(Long id) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        patientRepository.delete(existing);
    }

    private PatientDTO toDto(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setPatientId(patient.getPatientId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setAge(patient.getAge());
        dto.setContactNumber(patient.getContactNumber());
        dto.setEmail(patient.getEmail());
        dto.setAddress(patient.getAddress());
        return dto;
    }

    private void copyDtoToEntity(PatientDTO dto, Patient entity) {
        entity.setPatientId(dto.getPatientId());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setGender(dto.getGender());
        entity.setDateOfBirth(dto.getDateOfBirth());

        if (dto.getDateOfBirth() != null) {
            entity.setAge(java.time.Period.between(dto.getDateOfBirth(), java.time.LocalDate.now()).getYears());
        }

        entity.setContactNumber(dto.getContactNumber());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());

        if (dto.getDoctorId() != null) {
            DoctorDetails doctor = doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
            entity.setDoctor(doctor);
        }
    }

    @Override
    public List<PatientDTO> getPatientsByDoctorId(Long doctorId) {
        List<Patient> patients = patientRepository.findAllByDoctorId(doctorId);
        if (patients.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No patients found for this doctor");
        }
        return patients.stream()
                       .map(this::toDto)
                       .collect(Collectors.toList());
    }

    @Override
    public PatientDTO createSinglePatient(PatientDTO patientDTO) {
        Patient patient = new Patient();
        copyDtoToEntity(patientDTO, patient);
        Patient savedPatient = patientRepository.save(patient);
        return toDto(savedPatient);
    }



}



