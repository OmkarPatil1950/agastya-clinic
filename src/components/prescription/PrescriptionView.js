// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Stack,
//   CircularProgress,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";

// const PrescriptionView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [prescription, setPrescription] = useState(null);
//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const COLORS = {
//     headerBg: "#b2d4f5",
//     headerText: "#0d47a1",
//     border: "#bbdefb",
//     hover: "#f5faff",
//     zebra: "#f8fbff",
//     accent: "#1565c0",
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const prescriptionRes = await api.getPrescriptionById(id);
//         const prescriptionData = prescriptionRes.data;
//         setPrescription(prescriptionData);

//         if (prescriptionData?.patientId) {
//           const patientRes = await api.getPatientById(
//             prescriptionData.patientId,
//           );
//           setPatient(patientRes.data);
//         }

//         setError(null);
//       } catch (err) {
//         setError("Failed to load prescription details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (loading) {
//     return (
//       <Box textAlign="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" align="center" mt={3}>
//         {error}
//       </Typography>
//     );
//   }

//   if (!prescription) {
//     return (
//       <Typography align="center" mt={3}>
//         Prescription not found
//       </Typography>
//     );
//   }

//   return (
//     <Box maxWidth="900px" mx="auto" mt={4}>
//       {/* ACTION BUTTONS */}
//       <Stack direction="row" spacing={2} mb={3}>
//         <Button
//           variant="contained"
//           onClick={() => navigate(`/prescriptions/print/${id}`)}
//         >
//           Print
//         </Button>
//         <Button variant="outlined" onClick={() => navigate("/prescriptions")}>
//           Back
//         </Button>
//       </Stack>

//       <Paper elevation={3} sx={{ p: 3 }}>
//         {/* HEADER */}

//         {/* PATIENT INFO */}
//         <Divider sx={{ mb: 2 }} />
//         <Typography variant="h6" gutterBottom>
//           Patient Details
//         </Typography>

//         {patient ? (
//           <Paper
//             sx={{
//               position: "sticky",
//               top: 0,
//               zIndex: 10,
//               mb: 2,
//               p: 1.5,
//               background: COLORS.header,
//               border: `1px solid ${COLORS.border}`,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Box>
//               <Typography fontWeight={600}>
//                 {patient.firstName} {patient.lastName}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Patient age: {patient.age}
//               </Typography>
//             </Box>

//             <Typography variant="caption" color="text.secondary">
//               Visit Date: {prescription.visitDate}
//             </Typography>
//           </Paper>
//         ) : (
//           <Typography color="text.secondary">
//             Patient details not available
//           </Typography>
//         )}

//         {/* MEDICINES */}
//         <Divider sx={{ mb: 2 }} />
//         <Typography variant="h6" gutterBottom>
//           Prescribed Medicines
//         </Typography>

//         {prescription.prescriptionItems?.length > 0 ? (
//           <TableContainer component={Paper} variant="outlined">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Medicine</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Dosage</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Frequency</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Duration</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Instructions</strong>
//                   </TableCell><TableCell>
//                   <strong>purpose of visit</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {prescription.prescriptionItems.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{item.medicineName}</TableCell>
//                     <TableCell>{item.dosage}</TableCell>
//                     <TableCell>{item.frequency}</TableCell>
//                     <TableCell>{item.duration} days</TableCell>
//                     <TableCell>{item.instructions}</TableCell>
//                     <TableCell>{prescription.notes}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         ) : (
//           <Typography color="text.secondary">
//             No medicines prescribed
//           </Typography>
//         )}

      
//       </Paper>
//     </Box>
//   );
// };

// export default PrescriptionView;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../services/api";

const COLORS = {
  headerBg: "#b2d4f5",
  border: "#bbdefb",
};

const PrescriptionViewModal = ({ open, onClose, prescriptionId,colour }) => {
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !prescriptionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const prescriptionRes = await api.getPrescriptionById(prescriptionId);
        setPrescription(prescriptionRes.data);

        if (prescriptionRes.data?.patientId) {
          const patientRes = await api.getPatientById(
            prescriptionRes.data.patientId
          );
          setPatient(patientRes.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, prescriptionId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        {/* CLOSE BUTTON */}
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box textAlign="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Box p={3}>
            {/* PATIENT HEADER */}
            {patient && (
              <Paper
                sx={{
                  mb: 2,
                  p: 1.5,
                  background: colour,
                  border: `1px solid ${COLORS.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {patient.firstName} {patient.lastName}
                  </Typography>
                  <Typography variant="caption">
                    Age: {patient.age} | Gender: {patient.gender}
                  </Typography>
                </Box>

                <Typography variant="caption">
                  Visit Date: {prescription.visitDate}
                </Typography>
              </Paper>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* MEDICINES TABLE */}
            <Typography variant="h6" gutterBottom>
              Prescribed Medicines
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Instructions</TableCell>
                    <TableCell>Purpose</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescription.prescriptionItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.medicineName}</TableCell>
                      <TableCell>{item.dosage}</TableCell>
                      <TableCell>{item.frequency}</TableCell>
                      <TableCell>{item.duration} days</TableCell>
                      <TableCell>{item.instructions}</TableCell>
                      <TableCell>{prescription.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionViewModal;
