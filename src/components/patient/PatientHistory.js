import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Stack,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useParams, Link, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../services/api";
import { Grid } from "@mui/system";
import Form from "react-bootstrap/Form";
import PrescriptionViewModal from "../prescription/PrescriptionView";

/* ================= COLORS (same as PatientList) ================= */

const COLORS = {
  headerBg: "#b2d4f5",
  headerText: "#0d47a1",
  border: "#bbdefb",
  hover: "#f5faff",
  zebra: "#f8fbff",
  accent: "#1565c0",
};

/* ================= styled components ================= */
const PageContainer = styled(Container)(() => ({
  marginTop: 32,
  marginBottom: 32,
}));

const StyledRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: COLORS.hover,
  },
}));

const ActionsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: 8,
  justifyContent: "flex-end",
}));

/* ================= component ================= */

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const patientRes = await api.getPatientById(id);
      setPatient(patientRes.data);

      const prescriptionsRes = await api.getPrescriptionsByPatientId(id);
      setPrescriptions(prescriptionsRes.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load patient history");
    } finally {
      setLoading(false);
    }
  };

  const applyDateRangeFilter = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const res = await api.searchPrescriptionsByPatientAndDateRange(
        id,
        startDate,
        endDate,
      );
      setPrescriptions(res.data || []);
      setError(null);
    } catch {
      setError("Failed to filter prescriptions");
    } finally {
      setLoading(false);
    }
  };
  const prescriptionRef = useRef(null);

  const handleDownloadPDF = (prescription) => {
    setDownloading(true);

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    /* =====================
     CLINIC / DOCTOR (hardcoded)
  ===================== */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(21, 101, 192);
    doc.text("Agastya Clinic", pageWidth / 2, y, { align: "center" });

    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Dr. Tejashri Omkar Jadhav, BAMS, M.D. in Medicine (Ayurveda)", pageWidth / 2, y, {
      align: "center",
    });

    y += 6;
    doc.setFontSize(9);
    doc.text(
      "Shivaji Nagar Rd, CH, Yadavvadi road, Shiroli, Maharashtra 416122",
      pageWidth / 2,
      y,
      { align: "center" },
    );

    y += 4;
    doc.text(
      "Phone: +91 9511994525 | agastyahospital15@gmail.com",
      pageWidth / 2,
      y,
      { align: "center" },
    );

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Clinic Timings", pageWidth / 2, y, { align: "center" });

    y += 4;
    doc.setFont("helvetica", "normal");
    doc.text("Monday - Saturday: 6:00 PM - 10:00 PM", pageWidth / 2, y, {
      align: "center",
    });

    y += 4;
    doc.text("Sunday: Clinic Closed", pageWidth / 2, y, { align: "center" });

    /* ===== Divider ===== */
    y += 6;
    doc.setDrawColor(21, 101, 192);
    doc.setLineWidth(0.8);
    doc.line(14, y, pageWidth - 14, y);

    /* =====================
     PATIENT INFORMATION
  ===================== */

    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", 14, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Left column
    doc.text(`Name: ${prescription.patientName}`, 14, y);
    doc.text(`Age: ${patient?.age ?? "—"}`, 14, y + 7);
    doc.text(`Contact: ${patient?.contactNumber ?? "—"}`, 14, y + 14);

    // Right column
    doc.text(`Patient ID: ${prescription.patientId}`, pageWidth - 80, y);
    doc.text(`Gender: ${patient?.gender ?? "—"}`, pageWidth - 80, y + 7);

    doc.text(
      `Date: ${new Date(prescription.visitDate).toLocaleDateString()}`,
      pageWidth - 14,
      y + 21,
      { align: "right" },
    );

    y += 28;
    doc.setDrawColor(200);
    doc.line(14, y, pageWidth - 14, y);

    /* =====================
     DIAGNOSIS / NOTES
  ===================== */

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("DIAGNOSIS", 14, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(prescription.notes || "—", 14, y);

    y += 8;
    doc.line(14, y, pageWidth - 14, y);

    /* =====================
     MEDICATIONS
  ===================== */

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("MEDICATIONS", 14, y);

    const tableRows = prescription.prescriptionItems.map((item) => [
      item.medicineName,
      item.dosage,
      item.frequency,
      `${item.duration} days`,
      item.instructions || "—",
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: [["Medicine", "Dosage", "Frequency", "Duration", "Instructions"]],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [21, 101, 192],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 249, 255],
      },
    });

    /* =====================
   SIGNATURE (fixed bottom-right)
===================== */

const pageHeight = doc.internal.pageSize.getHeight();

// Distance from bottom
const signatureY = pageHeight - 30;

// Signature line
doc.setDrawColor(0);
doc.line(pageWidth - 80, signatureY, pageWidth - 14, signatureY);

// Label
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("Signature", pageWidth - 80, signatureY - 4);


    doc.setFont("helvetica", "bold");
    doc.text("Dr. Tejashri Omkar Jadhav, BAMS, MD", pageWidth - 80, signatureY + 8);

    doc.save(`${prescription.prescriptionId}.pdf`);
    setDownloading(false);
  };

  const handlePrint = (id) => {
    setSelectedPrescriptionId(id);
    setOpenView(true);
  };

  const loadOlderThanTwoYears = async () => {
    try {
      setLoading(true);
      const res = await api.getPrescriptionsOlderThanYears(id, 2);
      setPrescriptions(res.data || []);
      setError(null);
    } catch {
      setError("Failed to load older prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  if (loading) {
    return (
      <Typography align="center" mt={6}>
        Loading patient history…
      </Typography>
    );
  }

  if (!patient) {
    return <Alert severity="warning">Patient not found</Alert>;
  }

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ color: COLORS.headerText, mb: 2 }}
      >
        Prescription History of {patient.firstName}
      </Typography>
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          mb: 2,
          p: 1.5,
          background: COLORS.header,
          border: `1px solid ${COLORS.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontWeight={600}>
            {patient.firstName} {patient.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Patient age: {patient.age}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Total Visits: {prescriptions.length}
        </Typography>
      </Paper>
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} md={3}>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid
          size="grow"
          md={6}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button variant="outlined" onClick={applyDateRangeFilter}>
            Apply
          </Button>
          <Button variant="outlined" color="error" onClick={clearFilters}>
            Reset
          </Button>
          <Button
            variant="outlined"
            sx={{ color: COLORS.headerText }}
            onClick={loadOlderThanTwoYears}
          >
            Older than 2 years
          </Button>
        </Grid>
      </Grid>
      {/* </Paper> */}

      {/* Table */}

      {prescriptions.length === 0 ? (
        <Alert severity="info">No prescription history found.</Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 2 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["ID", "Date", "Notes", "Actions"].map((h) => (
                  <TableCell
                    key={h}
                    align={h === "Actions" ? "right" : "left"}
                    sx={{
                      backgroundColor: COLORS.headerBg,
                      color: COLORS.headerText,
                      fontWeight: 600,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {prescriptions.map((p, index) => (
                <StyledRow
                  key={p.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fff" : COLORS.zebra,
                  }}
                >
                  <TableCell>{p.prescriptionId}</TableCell>
                  <TableCell>
                    {formatDate(p.visitDate || p.prescriptionDate)}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{p.notes || "—"}</TableCell>
                  <TableCell align="center">
                    <ActionsWrapper>
                      <Tooltip title="View">
                        <Button
                          size="medium"
                          variant="outlined"
                          onClick={() => handlePrint(p.id)}
                        >
                          View
                        </Button>
                      </Tooltip>
                      <Tooltip title="Print">
                        <Button
                          variant="success"
                          onClick={() => handleDownloadPDF(p)}
                          disabled={downloading}
                        >
                          {downloading ? "Generating PDF..." : "Download PDF"}
                        </Button>
                      </Tooltip>
                    </ActionsWrapper>
                  </TableCell>
                </StyledRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Footer */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button component={Link} to={`/patients/view/${id}`} variant="outlined">
          Back
        </Button>

        <Button
          component={Link}
          to="/prescriptions/add"
          state={{
            patientFirstName: patient?.firstName,
            patientLastName: patient?.lastName,
            patientId: patient?.id,
          }}
          variant="contained"
          sx={{
            backgroundColor: COLORS.headerBg,
            color: COLORS.headerText,
          }}
        >
          + New Prescription
        </Button>
      </Box>
      <PrescriptionViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        prescriptionId={selectedPrescriptionId}
        colour={COLORS.headerBg}
      />
    </PageContainer>
  );
};

export default PatientHistory;