package com.hospital.prescription.dto;

import javax.validation.*;
import javax.validation.constraints.NotBlank;


public class DoctorLoginDto {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public DoctorLoginDto(@NotBlank String email, @NotBlank String password) {
		super();
		this.email = email;
		this.password = password;
	}

	public DoctorLoginDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
    
    
	
    
}