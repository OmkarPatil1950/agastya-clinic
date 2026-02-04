package com.hospital.prescription.model;

import javax.persistence.*;
import javax.validation.constraints.*;


@Entity
@Table(name = "doctor_details")
public class DoctorDetails {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Info
    @NotBlank
    @Column(nullable = false)
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String lastName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String gender;

    @NotNull
    @Min(25)
    @Max(100)
    @Column(nullable = false)
    private Integer age;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$")
    @Column(nullable = false, unique = true)
    private String contactNumber;

    // Professional Info
    @NotBlank
    @Column(nullable = false, unique = true)
    private String medicalLicenseNumber;

    @NotBlank
    @Column(nullable = false)
    private String specialization;

    @NotNull
    @Min(0)
    @Max(80)
    @Column(nullable = false)
    private Integer experienceYears;

    @NotBlank
    @Column(nullable = false)
    private String hospitalAffiliation;

    @NotBlank
    @Column(nullable = false)
    private String address;
    
    
    
   

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getMedicalLicenseNumber() {
		return medicalLicenseNumber;
	}

	public void setMedicalLicenseNumber(String medicalLicenseNumber) {
		this.medicalLicenseNumber = medicalLicenseNumber;
	}

	public String getSpecialization() {
		return specialization;
	}

	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}

	public Integer getExperienceYears() {
		return experienceYears;
	}

	public void setExperienceYears(Integer experienceYears) {
		this.experienceYears = experienceYears;
	}

	public String getHospitalAffiliation() {
		return hospitalAffiliation;
	}

	public void setHospitalAffiliation(String hospitalAffiliation) {
		this.hospitalAffiliation = hospitalAffiliation;
	}

	

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public DoctorDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DoctorDetails(Long id,
			@NotBlank @Size(max = 50, message = "First name must be at most 50 characters") String firstName,
			@NotBlank @Size(max = 50, message = "First name must be at most 50 characters") String lastName,
			@NotBlank @Email String email,
			@NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
			@NotBlank String gender, @NotNull @Min(25) @Max(100) Integer age,
			@NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") String contactNumber, @NotBlank String medicalLicenseNumber,
			@NotBlank String specialization, @NotNull @Min(0) @Max(80) Integer experienceYears,
			@NotBlank String hospitalAffiliation, @NotBlank String address) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.gender = gender;
		this.age = age;
		this.contactNumber = contactNumber;
		this.medicalLicenseNumber = medicalLicenseNumber;
		this.specialization = specialization;
		this.experienceYears = experienceYears;
		this.hospitalAffiliation = hospitalAffiliation;
		this.address = address;
	}

	
    
}
