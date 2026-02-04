package com.hospital.prescription.dto;

import javax.validation.constraints.NotBlank;

public class UpdatePasswordDto {

    @NotBlank
    private String email;

    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;

    
    
    
    
    
    
	public UpdatePasswordDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
	
	public UpdatePasswordDto(@NotBlank String email, @NotBlank String oldPassword, @NotBlank String newPassword) {
		super();
		this.email = email;
		this.oldPassword = oldPassword;
		this.newPassword = newPassword;
	}




	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}




	@Override
	public String toString() {
		return "UpdatePasswordDto [email=" + email + ", oldPassword=" + oldPassword + ", newPassword=" + newPassword
				+ "]";
	}

    // getters & setters
    
    
    
    
}
