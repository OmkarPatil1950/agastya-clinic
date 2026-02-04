package com.hospital.prescription.service;

import com.hospital.prescription.dto.DoctorLoginDto;
import com.hospital.prescription.dto.UpdatePasswordDto;
import com.hospital.prescription.model.DoctorDetails;
import java.util.List;
import java.util.Optional;

public interface RegisterService {

    // Save/register a new doctor
    DoctorDetails saveDoctor(DoctorDetails doctor);

        DoctorDetails login(DoctorLoginDto loginDto);
        DoctorDetails updatePassword(UpdatePasswordDto dto);

    
    // Get all doctors
    List<DoctorDetails> getAllDoctors();

    // Get doctor by ID
    Optional<DoctorDetails> getDoctorById(Long id);

    // Update doctor info
    DoctorDetails updateDoctor(Long id, DoctorDetails doctor);

    // Delete doctor
    void deleteDoctor(Long id);

    // Optional: find by email (useful for login)
    Optional<DoctorDetails> getDoctorByEmail(String email);
}
