package com.hospital.prescription.service.impl;

import com.hospital.prescription.dto.DoctorLoginDto;
import com.hospital.prescription.dto.UpdatePasswordDto;
import com.hospital.prescription.model.DoctorDetails;
import com.hospital.prescription.repository.DoctorRepository;
import com.hospital.prescription.service.RegisterService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class RegisterServiceImpl implements RegisterService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterServiceImpl(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public DoctorDetails saveDoctor(DoctorDetails doctor) {
        // You can add extra logic here, e.g., hashing password
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

        return doctorRepository.save(doctor);
    }

    @Override
    public List<DoctorDetails> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Optional<DoctorDetails> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public DoctorDetails updateDoctor(Long id, DoctorDetails doctor) {
        return doctorRepository.findById(id).map(existingDoctor -> {
            existingDoctor.setFirstName(doctor.getFirstName());
            existingDoctor.setLastName(doctor.getLastName());
            existingDoctor.setEmail(doctor.getEmail());
            existingDoctor.setGender(doctor.getGender());
            existingDoctor.setAge(doctor.getAge());
            existingDoctor.setContactNumber(doctor.getContactNumber());
            existingDoctor.setAddress(doctor.getAddress());
            existingDoctor.setMedicalLicenseNumber(doctor.getMedicalLicenseNumber());
            existingDoctor.setSpecialization(doctor.getSpecialization());
            existingDoctor.setExperienceYears(doctor.getExperienceYears());
            existingDoctor.setHospitalAffiliation(doctor.getHospitalAffiliation());
            existingDoctor.setPassword(doctor.getPassword());
            return doctorRepository.save(existingDoctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public Optional<DoctorDetails> getDoctorByEmail(String email) {
    	System.out.println("email");
    	System.out.println(doctorRepository.findByEmail(email));
        return doctorRepository.findByEmail(email);
    }

    @Override
    public DoctorDetails login(DoctorLoginDto loginDto) {

    	System.out.print(loginDto);
        DoctorDetails doctor = doctorRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!passwordEncoder.matches(loginDto.getPassword(), doctor.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return doctor;   // login successful
    }


    @Override
    public DoctorDetails updatePassword(UpdatePasswordDto dto) {

        DoctorDetails doctor = doctorRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Validate old password
        if (!passwordEncoder.matches(dto.getOldPassword(), doctor.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Encode & save new password
        doctor.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        return doctorRepository.save(doctor);
    }

	
	
	
}
