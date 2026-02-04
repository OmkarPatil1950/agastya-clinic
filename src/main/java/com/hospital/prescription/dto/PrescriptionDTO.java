package com.hospital.prescription.dto;



import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class PrescriptionDTO {
    private Long id;
    private String prescriptionId;
    private Long patientId;
    private String patientName;
    private LocalDate visitDate;
    private String notes;
    private List<PrescriptionItemDTO> prescriptionItems;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getPrescriptionId() {
		return prescriptionId;
	}
	public void setPrescriptionId(String prescriptionId) {
		this.prescriptionId = prescriptionId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public LocalDate getVisitDate() {
		return visitDate;
	}
	public void setVisitDate(LocalDate visitDate) {
		this.visitDate = visitDate;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
	public List<PrescriptionItemDTO> getPrescriptionItems() {
		return prescriptionItems;
	}
	public void setPrescriptionItems(List<PrescriptionItemDTO> prescriptionItems) {
		this.prescriptionItems = prescriptionItems;
	}
	public PrescriptionDTO(Long id, String prescriptionId, Long patientId, String patientName, LocalDate visitDate,
			String notes, List<PrescriptionItemDTO> prescriptionItems) {
		super();
		this.id = id;
		this.prescriptionId = prescriptionId;
		this.patientId = patientId;
		this.patientName = patientName;
		this.visitDate = visitDate;
		this.notes = notes;
		this.prescriptionItems = prescriptionItems;
	}
	public PrescriptionDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "PrescriptionDTO [id=" + id + ", prescriptionId=" + prescriptionId + ", patientId=" + patientId
				+ ", patientName=" + patientName + ", visitDate=" + visitDate + ", notes=" + notes
				+ ", prescriptionItems=" + prescriptionItems + "]";
	}
	
	
    
    
    
}