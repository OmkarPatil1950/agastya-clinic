//package com.hospital.prescription.service.impl;
//
//import com.hospital.prescription.dto.PrescriptionDTO;
//import com.hospital.prescription.dto.PrescriptionItemDTO;
//import com.hospital.prescription.model.Medicine;
//import com.hospital.prescription.model.Patient;
//import com.hospital.prescription.model.Prescription;
//import com.hospital.prescription.model.PrescriptionItem;
//import com.hospital.prescription.repository.MedicineRepository;
//import com.hospital.prescription.repository.PatientRepository;
//import com.hospital.prescription.repository.PrescriptionRepository;
//import com.hospital.prescription.service.PrescriptionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class PrescriptionServiceImpl implements PrescriptionService {
//
//    @Autowired
//    private PrescriptionRepository prescriptionRepository;
//
//    @Autowired
//    private PatientRepository patientRepository;
//
//    @Autowired
//    private MedicineRepository medicineRepository;
//
//    @Override
//    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
//        Prescription prescription = convertToEntity(prescriptionDTO);
//        Prescription savedPrescription = prescriptionRepository.save(prescription);
//        return convertToDTO(savedPrescription);
//    }
//
//    @Override
//    public PrescriptionDTO getPrescriptionById(Long id) {
//        Optional<Prescription> prescription = prescriptionRepository.findById(id);
//        return prescription.map(this::convertToDTO).orElse(null);
//    }
//
//    @Override
//    public PrescriptionDTO getPrescriptionByPrescriptionId(String prescriptionId) {
//        Optional<Prescription> prescription = prescriptionRepository.findByPrescriptionId(prescriptionId);
//        return prescription.map(this::convertToDTO).orElse(null);
//    }
//
//    @Override
//    public List<PrescriptionDTO> getAllPrescriptions() {
//        return prescriptionRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId) {
//        return prescriptionRepository.findByPatient_Id(patientId).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//    
//    @Override
//    public List<PrescriptionDTO> searchPrescriptions(Long patientId, LocalDate from, LocalDate to) {
//        List<Prescription> prescriptions;
//        if (patientId != null) {
//            prescriptions = prescriptionRepository.findByPatient_IdAndVisitDateBetween(patientId, from, to);
//        } else {
//            prescriptions = prescriptionRepository.findByVisitDateBetween(from, to);
//        }
//        return prescriptions.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//    
//    @Override
//    public List<PrescriptionDTO> getPrescriptionsOlderThanYears(Long patientId, int years) {
//        LocalDate cutoffDate = LocalDate.now().minusYears(years);
//        List<Prescription> prescriptions;
//        if (patientId != null) {
//            prescriptions = prescriptionRepository.findByPatient_IdAndVisitDateBefore(patientId, cutoffDate);
//        } else {
//            prescriptions = prescriptionRepository.findByVisitDateBefore(cutoffDate);
//        }
//        return prescriptions.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO) {
//        Optional<Prescription> existingPrescription = prescriptionRepository.findById(id);
//        if (existingPrescription.isPresent()) {
//            Prescription prescription = existingPrescription.get();
//            updatePrescriptionFromDTO(prescription, prescriptionDTO);
//            Prescription updatedPrescription = prescriptionRepository.save(prescription);
//            return convertToDTO(updatedPrescription);
//        }
//        return null;
//    }
//
//    @Override
//    public void deletePrescription(Long id) {
//        prescriptionRepository.deleteById(id);
//    }
//
//    private PrescriptionDTO convertToDTO(Prescription prescription) {
//        PrescriptionDTO dto = new PrescriptionDTO();
//        dto.setId(prescription.getId());
//        dto.setPrescriptionId(prescription.getPrescriptionId());
//        dto.setPatientId(prescription.getPatient() != null ? prescription.getPatient().getId() : null);
//        dto.setPatientName(prescription.getPatient() != null ?
//            prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName() : "");
//        dto.setVisitDate(prescription.getVisitDate());
//        dto.setNotes(prescription.getNotes());
//        dto.setPrescriptionItems(
//                prescription.getPrescriptionItems().stream()
//                        .map(this::convertItemToDTO)
//                        .collect(Collectors.toList())
//        );
//        return dto;
//    }
//
//    private PrescriptionItemDTO convertItemToDTO(PrescriptionItem item) {
//        PrescriptionItemDTO dto = new PrescriptionItemDTO();
//        dto.setId(item.getId());
//        dto.setDosage(item.getDosage());
//        dto.setFrequency(item.getFrequency());
//        dto.setDuration(item.getDuration());
//        return dto;
//    }
//
//    private Prescription convertToEntity(PrescriptionDTO dto) {
//        Prescription prescription = new Prescription();
//
//        if (dto.getPatientId() == null) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient ID is required");
//        }
//
//        Patient patient = patientRepository.findById(dto.getPatientId())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
//
//        prescription.setPatient(patient);
//        prescription.setVisitDate(dto.getVisitDate());
//        prescription.setNotes(dto.getNotes());
//
//        if (dto.getPrescriptionItems() != null) { List<PrescriptionItem> items = dto.getPrescriptionItems().stream() .map(itemDto -> convertItemToEntity(itemDto, prescription)) .collect(Collectors.toList()); prescription.setPrescriptionItems(items); }
//        return prescription;
//    }
//
//    private PrescriptionItem convertItemToEntity(PrescriptionItemDTO dto, Prescription prescription) {
//        PrescriptionItem item = new PrescriptionItem();
//        item.setPrescription(prescription);
//
//        if (dto.getMedicineId() == null) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medicine ID is required for each item");
//        }
//
//        Medicine medicine = medicineRepository.findById(dto.getMedicineId())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));
//
//        item.setDosage(dto.getDosage());
//        item.setFrequency(dto.getFrequency());
//        item.setDuration(dto.getDuration());
//        return item;
//    }
//
//    private void updatePrescriptionFromDTO(Prescription prescription, PrescriptionDTO dto) {
//        if (dto.getPatientId() != null && (prescription.getPatient() == null || !prescription.getPatient().getId().equals(dto.getPatientId()))) {
//            Patient patient = patientRepository.findById(dto.getPatientId())
//                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
//            prescription.setPatient(patient);
//        }
//
//        prescription.setVisitDate(dto.getVisitDate());
//        prescription.setNotes(dto.getNotes());
//
//        // Clear existing items and add new ones
//        prescription.getPrescriptionItems().clear();
//        if (dto.getPrescriptionItems() != null) {
//            List<PrescriptionItem> items = dto.getPrescriptionItems().stream()
//                    .map(itemDto -> convertItemToEntity(itemDto, prescription))
//                    .collect(Collectors.toList());
//            prescription.getPrescriptionItems().addAll(items);
//        }
//    }
//}


package com.hospital.prescription.service.impl;

import com.hospital.prescription.dto.PrescriptionDTO;
import com.hospital.prescription.dto.PrescriptionItemDTO;
import com.hospital.prescription.model.Medicine;
import com.hospital.prescription.model.Patient;
import com.hospital.prescription.model.Prescription;
import com.hospital.prescription.model.PrescriptionItem;
import com.hospital.prescription.repository.MedicineRepository;
import com.hospital.prescription.repository.PatientRepository;
import com.hospital.prescription.repository.PrescriptionRepository;
import com.hospital.prescription.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        Prescription prescription = convertToEntity(prescriptionDTO);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToDTO(savedPrescription);
    }

    @Override
    public PrescriptionDTO getPrescriptionById(Long id) {
    	System.out.println("inside service impl"+ prescriptionRepository.findById(id).toString());
        return prescriptionRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    @Override
    public PrescriptionDTO getPrescriptionByPrescriptionId(String prescriptionId) {
        return prescriptionRepository.findByPrescriptionId(prescriptionId).map(this::convertToDTO).orElse(null);
    }

    @Override
    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatient_Id(patientId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDTO> searchPrescriptions(Long patientId, LocalDate from, LocalDate to) {
        List<Prescription> prescriptions;
        if (patientId != null) {
            prescriptions = prescriptionRepository.findByPatient_IdAndVisitDateBetween(patientId, from, to);
        } else {
            prescriptions = prescriptionRepository.findByVisitDateBetween(from, to);
        }
        return prescriptions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDTO> getPrescriptionsOlderThanYears(Long patientId, int years) {
        LocalDate cutoffDate = LocalDate.now().minusYears(years);
        List<Prescription> prescriptions;
        if (patientId != null) {
            prescriptions = prescriptionRepository.findByPatient_IdAndVisitDateBefore(patientId, cutoffDate);
        } else {
            prescriptions = prescriptionRepository.findByVisitDateBefore(cutoffDate);
        }
        return prescriptions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO) {
        Optional<Prescription> existingPrescription = prescriptionRepository.findById(id);
        if (existingPrescription.isPresent()) {
            Prescription prescription = existingPrescription.get();
            updatePrescriptionFromDTO(prescription, prescriptionDTO);
            Prescription updatedPrescription = prescriptionRepository.save(prescription);
            return convertToDTO(updatedPrescription);
        }
        return null;
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    // ===================== Convert Entity ↔ DTO =====================
    private PrescriptionDTO convertToDTO(Prescription prescription) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setPrescriptionId(prescription.getPrescriptionId());
        dto.setPatientId(prescription.getPatient() != null ? prescription.getPatient().getId() : null);
        dto.setPatientName(prescription.getPatient() != null ?
                prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName() : "");
        dto.setVisitDate(prescription.getVisitDate());
        dto.setNotes(prescription.getNotes());
        dto.setPrescriptionItems(
                prescription.getPrescriptionItems().stream()
                        .map(this::convertItemToDTO)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    private PrescriptionItemDTO convertItemToDTO(PrescriptionItem item) {
        PrescriptionItemDTO dto = new PrescriptionItemDTO();
        dto.setId(item.getId());
        dto.setDosage(item.getDosage());
        dto.setFrequency(item.getFrequency());
        dto.setDuration(item.getDuration());
        dto.setInstructions(item.getInstructions());

        if (item.getMedicine() != null) {
            dto.setMedicineId(item.getMedicine().getId());
            dto.setMedicineName(item.getMedicine().getName());
        }

        return dto;
    }

    private Prescription convertToEntity(PrescriptionDTO dto) {
        Prescription prescription = new Prescription();

        if (dto.getPatientId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient ID is required");
        }

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        prescription.setPatient(patient);
        prescription.setVisitDate(dto.getVisitDate());
        prescription.setNotes(dto.getNotes());

        if (dto.getPrescriptionItems() != null) {
            List<PrescriptionItem> items = dto.getPrescriptionItems().stream()
                    .map(itemDto -> convertItemToEntity(itemDto, prescription))
                    .collect(Collectors.toList());
            prescription.setPrescriptionItems(items);
        }

        return prescription;
    }

    private PrescriptionItem convertItemToEntity(PrescriptionItemDTO dto, Prescription prescription) {
        PrescriptionItem item = new PrescriptionItem();
        item.setPrescription(prescription);
        item.setDosage(dto.getDosage());
        item.setFrequency(dto.getFrequency());
        item.setDuration(dto.getDuration());
        item.setInstructions(dto.getInstructions());

        if (dto.getMedicineId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medicine ID is required for each item");
        }

        Medicine medicine = medicineRepository.findById(dto.getMedicineId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicine not found"));

        item.setMedicine(medicine);

        return item;
    }

    private void updatePrescriptionFromDTO(Prescription prescription, PrescriptionDTO dto) {
        if (dto.getPatientId() != null && (prescription.getPatient() == null || !prescription.getPatient().getId().equals(dto.getPatientId()))) {
            Patient patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
            prescription.setPatient(patient);
        }

        prescription.setVisitDate(dto.getVisitDate());
        prescription.setNotes(dto.getNotes());

        // Clear existing items and add new ones
        prescription.getPrescriptionItems().clear();
        if (dto.getPrescriptionItems() != null) {
            List<PrescriptionItem> items = dto.getPrescriptionItems().stream()
                    .map(itemDto -> convertItemToEntity(itemDto, prescription))
                    .collect(Collectors.toList());
            prescription.getPrescriptionItems().addAll(items);
        }
    }
}
