package com.hospital.prescription.dto;



import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class PrescriptionItemDTO {
    private Long id;
    
    @NotNull(message = "Medicine is required")
    private Long medicineId;
    
    private String medicineName;
    
    @NotNull(message = "Dosage is required")
    private String dosage;
    
    @NotNull(message = "Frequency is required")
    private String frequency;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration;
    
    private String instructions;

	public PrescriptionItemDTO(Long id, @NotNull(message = "Medicine is required") Long medicineId, String medicineName,
			@NotNull(message = "Dosage is required") String dosage,
			@NotNull(message = "Frequency is required") String frequency,
			@NotNull(message = "Duration is required") @Positive(message = "Duration must be positive") Integer duration,
			String instructions) {
		super();
		this.id = id;
		this.medicineId = medicineId;
		this.medicineName = medicineName;
		this.dosage = dosage;
		this.frequency = frequency;
		this.duration = duration;
		this.instructions = instructions;
	}

	public PrescriptionItemDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getMedicineId() {
		return medicineId;
	}

	public void setMedicineId(Long medicineId) {
		this.medicineId = medicineId;
	}

	public String getMedicineName() {
		return medicineName;
	}

	public void setMedicineName(String medicineName) {
		this.medicineName = medicineName;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}
    
    
    
}