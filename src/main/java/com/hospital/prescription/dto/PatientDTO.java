package com.hospital.prescription.dto;

import javax.validation.constraints.*;
import java.time.LocalDate;

public class PatientDTO {

    private Long id;

    private String patientId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String gender;

    @Past(message = "Date of birth must be in the past")
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    private Integer age;

    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    private String contactNumber;

    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;
    
    private Long doctorId;


    // Default constructor
    public PatientDTO() {
    }

    
    // All-args constructor
    
    public PatientDTO(Long id, String patientId, @NotBlank(message = "First name is required") String firstName,
			@NotBlank(message = "Last name is required") String lastName, String gender,
			@Past(message = "Date of birth must be in the past") @NotNull(message = "Date of birth is required") LocalDate dateOfBirth,
			Integer age,
			@Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits") String contactNumber,
			@Email(message = "Email should be valid") String email,
			@Size(max = 255, message = "Address cannot exceed 255 characters") String address, Long doctorId) {
		super();
		this.id = id;
		this.patientId = patientId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.age = age;
		this.contactNumber = contactNumber;
		this.email = email;
		this.address = address;
		this.doctorId = doctorId;
	}


	// Getters & Setters
   

	@Override
	public String toString() {
		return "PatientDTO [id=" + id + ", patientId=" + patientId + ", firstName=" + firstName + ", lastName="
				+ lastName + ", gender=" + gender + ", dateOfBirth=" + dateOfBirth + ", age=" + age + ", contactNumber="
				+ contactNumber + ", email=" + email + ", address=" + address + ", doctorId=" + doctorId + "]";
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getPatientId() {
		return patientId;
	}


	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}


	public String getFirstName() {
		return firstName;
	}


	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getLastName() {
		return lastName;
	}


	public void setLastName(String lastName) {
		this.lastName = lastName;
	}


	public String getGender() {
		return gender;
	}


	public void setGender(String gender) {
		this.gender = gender;
	}


	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}


	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}


	public Integer getAge() {
		return age;
	}


	public void setAge(Integer age) {
		this.age = age;
	}


	public String getContactNumber() {
		return contactNumber;
	}


	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public Long getDoctorId() {
		return doctorId;
	}


	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

    
}
