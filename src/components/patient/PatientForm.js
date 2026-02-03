import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

/* ================= styled components ================= */

const PageContainer = styled(Container)(() => ({
  marginTop: 32,
  marginBottom: 32,
}));

const FormCard = styled(Paper)(() => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: "#f5faff",
}));

const Title = styled(Typography)(() => ({
  marginBottom: 24,
  fontWeight: 600,
  color: "#0d47a1",
}));

/* ================= component ================= */

const PatientForm = () => {
  const docId =localStorage.getItem("doctor")
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
    address: "",
    doctorId:docId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getPatientDocById(docId);
      const patient = res.data;

      setFormData({
        ...patient,
        dateOfBirth: patient.dateOfBirth
          ? patient.dateOfBirth.split("T")[0]
          : "",
      });
      setError(null);
    } catch (e) {
      setError("Failed to fetch patient data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) fetchPatient();
  }, [isEditMode, fetchPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        formData.age = age;
      }

      if (isEditMode) {
        await api.updatePatient(id, formData);
      } else {
        await api.createPatient(formData);
      }

      navigate("/patients");
    } catch (e) {
      setError("Failed to save patient.");
      console.error(e);
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress color="primary" />
        <Typography mt={2}>Loading patient data…</Typography>
      </Box>
    );
  }

  return (
    <PageContainer maxWidth="sm">
      <FormCard elevation={3}>
        <Title variant="h5">
          {isEditMode ? "Edit Patient" : "Add New Patient"}
        </Title>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            InputLabelProps={{ shrink: true }}
            value={formData.dateOfBirth}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            margin="normal"
          />

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#0d47a1" },
              }}
            >
              {loading ? "Saving…" : "Save Patient"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/patients")}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </FormCard>
    </PageContainer>
  );
};

export default PatientForm;
