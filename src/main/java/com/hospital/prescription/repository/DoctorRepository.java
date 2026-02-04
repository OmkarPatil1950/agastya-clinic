package com.hospital.prescription.repository;

import com.hospital.prescription.model.DoctorDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<DoctorDetails, Long> {
    Optional<DoctorDetails> findByEmail(String email);
}
