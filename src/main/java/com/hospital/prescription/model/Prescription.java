package com.hospital.prescription.model;


import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "prescriptions")
public class Prescription {
    
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(unique = true)
	    private String prescriptionId;

	    @ManyToOne(fetch = FetchType.EAGER) // fetch patient info automatically
	    @JoinColumn(name = "patient_id")
	    private Patient patient;

	    private LocalDate visitDate;

	    private String notes;

	    @OneToMany(
	    	    mappedBy = "prescription",
	    	    cascade = CascadeType.ALL,
	    	    orphanRemoval = true,
	    	    fetch = FetchType.LAZY   // ✅ CHANGE THIS
	    	)
	    	@JsonManagedReference
	    	private List<PrescriptionItem> prescriptionItems = new ArrayList<>();


	    @PrePersist
	    public void generatePrescriptionId() {
	        if (this.prescriptionId == null || this.prescriptionId.trim().isEmpty()) {
	            this.prescriptionId = "RX" + System.currentTimeMillis();
	        }
	    }
    
    // Manual getters and setters due to Lombok issues in build
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public List<PrescriptionItem> getPrescriptionItems() { return prescriptionItems; }
    public void setPrescriptionItems(List<PrescriptionItem> prescriptionItems) { this.prescriptionItems = prescriptionItems; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

	@Override
	public String toString() {
		return "Prescription [id=" + id + ", prescriptionId=" + prescriptionId + ", patient=" + patient + ", visitDate="
				+ visitDate + ", notes=" + notes + ", prescriptionItems=" + prescriptionItems + "]";
	}
    
    
    
}