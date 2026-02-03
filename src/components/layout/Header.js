import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api"; // Make sure path is correct
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(localStorage.getItem("doctor"));
  // Check if doctor is logged in

  useEffect(() => {
    setDoctor(localStorage.getItem("doctor"));
  }, [doctor]);

  // Initialize doctor data
  const [doctorData, setDoctorData] = useState(
    doctor || {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      age: "",
      contactNumber: "",
      medicalLicenseNumber: "",
      specialization: "",
      experienceYears: "",
      hospitalAffiliation: "",
      address: "",
    },
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Open modal and fetch doctor data
  const handleOpen = async () => {
    if (!doctor) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await api.getById(doctor); // pass id to API
      if (response.status === 200) {
        setDoctorData(response.data);
      }
      setOpen(true);
    } catch (error) {
      toast.error("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    navigate("/login");
  };

  const handleSave = async () => {
    try {
      console.log(doctorData);
      // Optionally call API to update doctor profile
      await api.updateDoctor(doctorData.id, doctorData);

      localStorage.setItem("doctor", doctorData.id);
      setEditMode(false);
      setTimeout(() => {
        toast.success("Profile updated!");
        setOpen(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile!");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <Navbar bg="light" expand="lg" className="shadow-sm rounded mb-4">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center fw-bold text-primary"
          >
            <MedicationLiquidOutlinedIcon size={28} className="me-2" />
            Agastya Clinic
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* Profile icon */}
              <Box
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                title="Doctor Profile"
                onClick={handleOpen}
              >
                <MedicationLiquidOutlinedIcon />
              </Box>

              {doctor ? <Button
                variant="outlined"
                style={{ marginLeft: "4px" }}
                onClick={handleLogout}
              >
                Logout
              </Button> : <></>}
              
            </Nav>
          </Navbar.Collapse>
        </Container>

        <style>
          {`
            .nav-link:hover {
              color: #0d6efd !important;
            }
          `}
        </style>
      </Navbar>

      {/* Doctor Modal */}
      <Modal open={open} onClose={handleClose}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "95%", sm: 600 },
      maxHeight: "90vh",
      overflowY: "auto",
      bgcolor: "#fff",
      borderRadius: 3,
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      p: 4,
    }}
  >
    <Typography variant="h5" fontWeight={600} mb={3}>
      Doctor Profile
    </Typography>

    {/* Personal Information */}
    <Box
      sx={{
        bgcolor: "#f5f7fb",
        p: 2,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Personal Information
      </Typography>

      <TextField fullWidth label="First Name" value={doctorData.firstName}
        name="firstName" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Last Name" value={doctorData.lastName}
        name="lastName" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Email" value={doctorData.email}
        name="email" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Gender" value={doctorData.gender}
        name="gender" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Age" value={doctorData.age}
        name="age" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Contact Number" value={doctorData.contactNumber}
        name="contactNumber" onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />
      <TextField fullWidth label="Address" value={doctorData.address}
        name="address" onChange={handleInputChange} disabled={!editMode} />
    </Box>

    {/* Professional Information */}
    <Box
      sx={{
        bgcolor: "#f5f7fb",
        p: 2,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Professional Information
      </Typography>

      <TextField fullWidth label="Medical License Number"
        name="medicalLicenseNumber" value={doctorData.medicalLicenseNumber}
        onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />

      <TextField fullWidth label="Specialization"
        name="specialization" value={doctorData.specialization}
        onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />

      <TextField fullWidth label="Experience Years"
        name="experienceYears" value={doctorData.experienceYears}
        onChange={handleInputChange} disabled={!editMode} sx={{ mb: 2 }} />

      <TextField fullWidth label="Hospital Affiliation"
        name="hospitalAffiliation" value={doctorData.hospitalAffiliation}
        onChange={handleInputChange} disabled={!editMode} />
    </Box>

    {/* Actions */}
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      {editMode ? (
        <Button
          variant="contained"
          sx={{ bgcolor: "#1976d2" }}
          onClick={handleSave}
        >
          Save
        </Button>
      ) : (
        <Button variant="outlined" onClick={() => setEditMode(true)}>
          Edit
        </Button>
      )}

      <Button variant="text" color="inherit" onClick={handleClose}>
        Close
      </Button>
    </Box>
  </Box>
</Modal>

    </div>
  );
};

export default Header;
