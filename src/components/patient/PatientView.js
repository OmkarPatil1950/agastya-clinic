// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../../services/api';

// const PatientView = () => {
//     const { id } = useParams();
//     const [patient, setPatient] = useState(null);

//     useEffect(() => {
//         const fetchPatient = async () => {
//             try {
//                 const response = await api.getPatientById(id);
//                 setPatient(response.data);
//             } catch (error) {
//                 console.error('Error fetching patient:', error);
//             }
//         };

//         fetchPatient();
//     }, [id]);

//     if (!patient) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="container mt-4">
//             <h2>Patient Details</h2>
//             <div className="card">
//                 <div className="card-body">
//                     <h5 className="card-title">{patient.firstName} {patient.lastName}</h5>
//                     <p className="card-text"><strong>Patient ID:</strong> {patient.patientId}</p>
//                     <p className="card-text"><strong>Gender:</strong> {patient.gender}</p>
//                     <p className="card-text"><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
//                     <p className="card-text"><strong>Age:</strong> {patient.age}</p>
//                     <p className="card-text"><strong>Contact Number:</strong> {patient.contactNumber}</p>
//                     <p className="card-text"><strong>Email:</strong> {patient.email}</p>
//                     <p className="card-text"><strong>Address:</strong> {patient.address}</p>
//                     <Link to={`/patients/edit/${id}`} className="btn btn-primary">Edit</Link>
//                     <Link to="/patients" className="btn btn-secondary ms-2">Back to List</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientView;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import api from "../../services/api";

const PatientView = () => {
  const { id } = useParams(); // patient id from URL
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);

        // Fetch patient basic info
        const patientRes = await api.getPatientById(id);
        setPatient(patientRes.data);

        // Fetch patient history
        const historyRes = await api.getPrescriptionsByPatientId(id);
        setHistory(historyRes.data);

        setError(null);
      } catch (e) {
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return <CircularProgress style={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md" style={{ marginTop: 32 }}>
      <Button component={Link} to="/patients" variant="outlined" style={{ marginBottom: 16 }}>
        Back to List
      </Button>

      <Typography variant="h5" gutterBottom>
        Patient Details
      </Typography>

      <Paper style={{ padding: 16, marginBottom: 24 }}>
        <Typography><b>ID:</b> {patient.id}</Typography>
        <Typography><b>Name:</b> {patient.firstName} {patient.lastName}</Typography>
        <Typography><b>Age:</b> {patient.age}</Typography>
        <Typography><b>Gender:</b> {patient.gender}</Typography>
        <Typography><b>Contact:</b> {patient.contactNumber}</Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Patient History
      </Typography>

      {history.length === 0 ? (
        <Alert severity="info">No history available for this patient.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>{item.doctorName}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PatientView;
