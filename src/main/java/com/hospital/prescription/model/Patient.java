package com.hospital.prescription.model;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String patientId;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    private String gender;

    @Past
    @NotNull
    private LocalDate dateOfBirth;

    private Integer age;

    @Pattern(regexp = "\\d{10}")
    private String contactNumber;

    @Email
    private String email;

    @Size(max = 255)
    private String address;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Prescription> prescriptions = new ArrayList<>();
    
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")  // foreign key in patient table
    private DoctorDetails doctor;

    // Default constructor
    public Patient() {
    }
	public Patient(Long id, String patientId, @NotBlank String firstName, @NotBlank String lastName, String gender,
			@Past @NotNull LocalDate dateOfBirth, Integer age, @Pattern(regexp = "\\d{10}") String contactNumber,
			@Email String email, @Size(max = 255) String address, List<Prescription> prescriptions) {
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
		this.prescriptions = prescriptions;
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
	public List<Prescription> getPrescriptions() {
		return prescriptions;
	}
	public void setPrescriptions(List<Prescription> prescriptions) {
		this.prescriptions = prescriptions;
	}
	public DoctorDetails getDoctor() {
		return doctor;
	}
	public void setDoctor(DoctorDetails doctor) {
		this.doctor = doctor;
	}



}
