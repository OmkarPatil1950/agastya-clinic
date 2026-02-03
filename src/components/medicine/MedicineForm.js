import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  FormControlLabel,
  Switch,
  Stack,
  CircularProgress,
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
  backgroundColor: "#f1f8f4",
}));

const Title = styled(Typography)(() => ({
  marginBottom: 24,
  fontWeight: 600,
  color: "#1b5e20",
}));

/* ================= component ================= */

const MedicineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manufacturer: "",
    category: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicine = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getMedicineById(id);
      setFormData(res.data);
      setError(null);
    } catch (e) {
      setError("Failed to fetch medicine data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchMedicine();
    }
  }, [isEditMode, fetchMedicine]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEditMode) {
        await api.updateMedicine(id, formData);
      } else {
        await api.createMedicine(formData);
      }

      navigate("/medicines");
    } catch (e) {
      setError("Failed to save medicine.");
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress color="success" />
        <Typography mt={2}>Loading medicine data…</Typography>
      </Box>
    );
  }

  return (
    <PageContainer maxWidth="sm">
      <FormCard elevation={3}>
        <Title variant="h5">
          {isEditMode ? "Edit Medicine" : "Add New Medicine"}
        </Title>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Medicine Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          />

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
                color="success"
              />
            }
            label={formData.isActive ? "Active" : "Inactive"}
          />

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": { backgroundColor: "#1b5e20" },
              }}
            >
              {loading ? "Saving…" : "Save Medicine"}
            </Button>

            <Button
              variant="outlined"
              color="success"
              onClick={() => navigate("/medicines")}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </FormCard>
    </PageContainer>
  );
};

export default MedicineForm;
