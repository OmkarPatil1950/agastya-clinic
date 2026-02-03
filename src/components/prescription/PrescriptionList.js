import React, { useEffect, useState } from "react";
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
  TextField,
  Typography,
  Alert,
  Stack,
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import PrescriptionViewModal from "./PrescriptionView";

/* ================= styled components ================= */

const PageContainer = styled(Container)(() => ({
  marginTop: 32,
  marginBottom: 32,
}));

const HeaderRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 24,
  flexWrap: "wrap",
}));

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: "#fce4ec",
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  backgroundColor: "#f48fb1",
  fontWeight: 600,
  color: "#880e4f",
  borderBottom: "1px solid #f8bbd0",
}));

const SearchBox = styled(TextField)(() => ({
  minWidth: 300,
  backgroundColor: "#fff",
}));

const StyledRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#fdf1f5",
  },
}));

const ActionsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: 8,
}));

/* ================= component ================= */

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    const [openView, setOpenView] = useState(false);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [query]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.getAllPrescriptions();
      setPrescriptions(res.data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Unable to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };
 const handlePrint = (id) => {
    setSelectedPrescriptionId(id);
    setOpenView(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription permanently?")) return;

    try {
      await api.deletePrescription(id);
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError("Failed to delete prescription.");
    }
  };

  /* ================= helpers ================= */

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d) ? "" : d.toLocaleDateString();
  };

  const normalize = (v) => String(v ?? "").toLowerCase();
  /* ================= filtering ================= */

  const filteredPrescriptions = prescriptions.filter((p) => {
    const q = normalize(query);
    if (!q) return true;

    return (
      normalize(p.prescriptionId).includes(q) ||
      normalize(p.patientName).includes(q) ||
      normalize(p.patientId).includes(q)
    );
  });

  const paginatedPrescriptions = filteredPrescriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading) {
    return (
      <Typography align="center" mt={6}>
        Loading prescriptions…
      </Typography>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <HeaderRow>
        <Typography variant="h5" sx={{ color: "#880e4f", fontWeight: 600 }}>
          Prescription Management
        </Typography>
        <SearchBox
          size="small"
          placeholder="Search by prescription or patient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button
          component={Link}
          to="/prescriptions/add"
          variant="contained"
          sx={{
            backgroundColor: "#d81b60",
            "&:hover": { backgroundColor: "#ad1457" },
          }}
        >
          Add Prescription
        </Button>
      </HeaderRow>

      {error && <Alert severity="error">{error}</Alert>}

      {filteredPrescriptions.length === 0 ? (
        <Alert severity="info">No prescriptions found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell>Prescription ID</StyledHeaderCell>
                <StyledHeaderCell>Visit Date</StyledHeaderCell>
                <StyledHeaderCell>Patient</StyledHeaderCell>
                <StyledHeaderCell align="center">Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {paginatedPrescriptions.map((p) => (
                <StyledRow key={p.id}>
                  <TableCell>{p.prescriptionId}</TableCell>
                  <TableCell>{formatDate(p.visitDate)}</TableCell>
                  <TableCell>
                    {p.patientName || `Patient #${p.patientId}`}
                  </TableCell>
                  <TableCell align="right">
                    <ActionsWrapper sx={{ justifyContent: "center" }}>
                      <Tooltip title="View Prescription">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#d81b60",
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                          component={Link}
                                                    onClick={() => handlePrint(p.id)}
                        >
                          <FaEye />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Prescription">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </ActionsWrapper>
                  </TableCell>
                </StyledRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 25, 50]}
            count={filteredPrescriptions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}
       <PrescriptionViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        prescriptionId={selectedPrescriptionId}
        colour={"#f48fb1"}
      />
    </PageContainer>
  );
};

export default PrescriptionList;
