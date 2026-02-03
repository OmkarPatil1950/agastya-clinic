import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
const [patients, setPatients] = useState([]);

  const { patientFirstName, patientLastName, patientId, notes: initialNotes = "" } =
    location.state || {};

const hasPatientFromRoute = Boolean(patientId);


    console.log(location.state)
  const COLORS = {
    headerBg: "#b2d4f5",
    headerText: "#0d47a1",
    border: "#bbdefb",
    hover: "#f5faff",
    zebra: "#f8fbff",
    accent: "#1565c0",
  };
useEffect(() => {
  if (!hasPatientFromRoute) {
    const loadPatients = async () => {
      try {
        const res = await api.getAllPatients();
        setPatients(res.data);
      } catch (e) {
        setError("Failed to load patients");
      }
    };
    loadPatients();
  }
}, [hasPatientFromRoute]);
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    visitDate: new Date().toISOString().split("T")[0],
    notes: initialNotes,
    prescriptionItems: [],
  });

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newItem, setNewItem] = useState({
    medicineId: "",
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  // Fetch medicines from API
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const res = await api.getAllMedicines();
        setMedicines(res.data);
      } catch (err) {
        setError("Failed to load medicines");
      }
    };
    loadMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    if (name === "medicineId") {
      const med = medicines.find((m) => String(m.id) === String(value));
      setNewItem((prev) => ({
        ...prev,
        medicineId: value,
        medicineName: med ? med.name : "",
      }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = () => {
    if (!newItem.medicineId || !newItem.dosage || !newItem.frequency || !newItem.duration) {
      setError("Please fill all medicine details");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      prescriptionItems: [
        ...prev.prescriptionItems,
        {
          ...newItem,
          medicineId: Number(newItem.medicineId),
          duration: Number(newItem.duration),
        },
      ],
    }));

    setNewItem({
      medicineId: "",
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
    setError(null);
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!formData.patientId) {
  setError("Please select a patient");
  return;
}

    if (!formData.prescriptionItems.length) {
      setError("Please add at least one medicine");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Submitting prescription:", formData);
      await api.createPrescription(formData); // API call
      navigate("/prescriptions"); // redirect after save
    } catch (err) {
      setError("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Patient Header */}
        {/* Patient Selection (when not coming from patient page) */}
{!hasPatientFromRoute && (
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Patient</InputLabel>
    <Select
      name="patientId"
      value={formData.patientId}
      label="Patient"
      onChange={handleChange}
      sx={{ backgroundColor: "#fff" }}
    >
      <MenuItem value="">Select Patient</MenuItem>
      {patients.map((p) => (
        <MenuItem key={p.id} value={p.id}>
          {p.firstName} {p.lastName} (#{p.id})
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
        <Paper
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            mb: 2,
            p: 1.5,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
           <Box>
  <Typography fontWeight={600}>
    {hasPatientFromRoute
      ? `${patientFirstName} ${patientLastName}`
      : patients.find(p => p.id === formData.patientId)
          ? `${patients.find(p => p.id === formData.patientId).firstName}
             ${patients.find(p => p.id === formData.patientId).lastName}`
          : ""}
  </Typography>

  <Typography variant="caption" color="text.secondary">
    Prescription
  </Typography>
</Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Date: {formData.visitDate}
          </Typography>
        </Paper>

        {/* Notes */}
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          sx={{ mb: 2, backgroundColor: "#fff" }}
        />

        {/* Add Medicines */}
        <Paper
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            mb: 3,
          }}
        >
          {/* Section Header */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${COLORS.border}` }}>
            <Typography fontWeight={600}>💊 Add Medicines</Typography>
          </Box>

          {/* Form Body */}
          <Box sx={{ p: 2 }}>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr 1fr 1fr 1fr auto" }}
              gap={2}
              alignItems="center"
            >
              <FormControl fullWidth size="small">
                <InputLabel>Medicine</InputLabel>
                <Select
                  name="medicineId"
                  value={newItem.medicineId}
                  label="Medicine"
                  onChange={handleNewItemChange}
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">Select Medicine</MenuItem>
                  {medicines.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Dosage"
                name="dosage"
                value={newItem.dosage}
                onChange={handleNewItemChange}
                sx={{ backgroundColor: "#fff" }}
              />

              <TextField
                size="small"
                label="Frequency"
                name="frequency"
                value={newItem.frequency}
                onChange={handleNewItemChange}
                sx={{ backgroundColor: "#fff" }}
              />

              <TextField
                size="small"
                label="Duration"
                name="duration"
                value={newItem.duration}
                onChange={handleNewItemChange}
                sx={{ backgroundColor: "#fff" }}
              />

              <TextField
                size="small"
                label="Instructions"
                name="instructions"
                value={newItem.instructions}
                onChange={handleNewItemChange}
                sx={{ backgroundColor: "#fff" }}
              />

              <Button
                variant="contained"
                sx={{
                  height: 40,
                  px: 3,
                  backgroundColor: COLORS.headerText,
                  color: "#fff",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={handleAddItem}
              >
                Add
              </Button>
            </Box>

            {/* Items Table */}
            {formData.prescriptionItems.length > 0 && (
              <TableContainer
                component={Paper}
                sx={{ mt: 3, border: `1px solid ${COLORS.border}`, background: "#fff" }}
              >
                <Table size="small">
                  <TableHead sx={{ background: COLORS.headerBg }}>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Instructions</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.prescriptionItems.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.medicineName || item.medicineId}</TableCell>
                        <TableCell>{item.dosage}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>{item.instructions || "-"}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="error"
                            sx={{ textTransform: "none" }}
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>

        {/* Actions */}
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2, backgroundColor: COLORS.headerText, color: "#fff" }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Prescription"}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/prescriptions")}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default PrescriptionForm;
