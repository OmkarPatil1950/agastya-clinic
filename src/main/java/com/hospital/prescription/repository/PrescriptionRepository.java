package com.hospital.prescription.repository;

import com.hospital.prescription.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByPrescriptionId(String prescriptionId);
    // Corrected relationship-based query
    List<Prescription> findByPatient_Id(Long patientId);
    // Date range queries
    List<Prescription> findByVisitDateBetween(LocalDate from, LocalDate to);
    List<Prescription> findByPatient_IdAndVisitDateBetween(Long patientId, LocalDate from, LocalDate to);
    // Older-than queries
    List<Prescription> findByVisitDateBefore(LocalDate cutoff);
    List<Prescription> findByPatient_IdAndVisitDateBefore(Long patientId, LocalDate cutoff);
}