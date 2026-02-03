import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api"; // <-- make sure this path is correct

const genders = ["Male", "Female", "Other"];

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    contactNumber: "",
    medicalLicenseNumber: "",
    specialization: "",
    experienceYears: "",
    hospitalAffiliation: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // optional: for disabling button while API call
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegister = async () => {
    // Validate fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "This field is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Call backend API
      console.log(formData);

      const payload = {
        ...formData,
        age: parseInt(formData.age),
        experienceYears: parseInt(formData.experienceYears),
      };
      const response = await api.createDoctor(payload); // <-- make sure this exists in api.js

      if (response.status === 200 || response.status === 201) {
        // Show toast and navigate after 1 second (1000 ms)
        setTimeout(() => {
          toast.success("Doctor registered successfully!");
          navigate("/login");
        }, 1000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        background: "linear-gradient(135deg, #71b7e6, #9b59b6)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, p: 5 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
          >
            Doctor Registration
          </Typography>

          {/* First Name & Last Name */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>

          {/* Email & Password */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Gender & Age */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="gender"
              label="Gender"
              select
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.gender}
              helperText={errors.gender}
            >
              {genders.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.age}
              helperText={errors.age}
            />
          </Box>

          {/* Other Fields */}
          <TextField
            name="contactNumber"
            label="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
            sx={{ mb: 2 }}
          />
          <TextField
            name="medicalLicenseNumber"
            label="Medical License Number"
            value={formData.medicalLicenseNumber}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.medicalLicenseNumber}
            helperText={errors.medicalLicenseNumber}
            sx={{ mb: 2 }}
          />
          <TextField
            name="specialization"
            label="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.specialization}
            helperText={errors.specialization}
            sx={{ mb: 2 }}
          />

          {/* Experience & Hospital */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="experienceYears"
              label="Years of Experience"
              type="number"
              value={formData.experienceYears}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.experienceYears}
              helperText={errors.experienceYears}
            />
            <TextField
              name="hospitalAffiliation"
              label="Hospital Affiliation"
              value={formData.hospitalAffiliation}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.hospitalAffiliation}
              helperText={errors.hospitalAffiliation}
            />
          </Box>

          {/* Address */}
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            required
            error={!!errors.address}
            helperText={errors.address}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(90deg, #6c5ce7, #a29bfe)",
              fontWeight: "bold",
              fontSize: 16,
              "&:hover": {
                background: "linear-gradient(90deg, #5a4bcf, #8c7ce6)",
              },
            }}
            onClick={handleRegister}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Typography
            sx={{ mt: 3, color: "#777", fontSize: 14 }}
            onClick={() => navigate("/login")} // <-- navigate to register page
          >
            already handleSave account?{" "}
            <span style={{ color: "#6c5ce7", cursor: "pointer" }}>
              Login
            </span>
          </Typography>
        </Box>
      </Paper>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default DoctorRegister;
