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
  backgroundColor: "#e3f2fd",
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  backgroundColor: "#7fb2db",
  fontWeight: 600,
  color: "#0d47a1",
  borderBottom: "1px solid #bbdefb",
}));

const SearchBox = styled(TextField)(() => ({
  minWidth: 300,
  backgroundColor: "#fff",
}));


const StyledRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#f5faff",
  },
}));

const ActionsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: 6,
}));

/* ================= component ================= */

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [query]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.getAllPatients();
      setPatients(res.data);
      setError(null);
    } catch (e) {
      setError("Unable to load patients.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient permanently?")) return;

    try {
      await api.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError("Failed to delete patient.");
    }
  };

  /* ================= filtering ================= */

  const normalize = (v) => (v || "").toLowerCase();

  const filteredPatients = patients.filter((p) => {
    const q = normalize(query);
    if (!q) return true;

    return (
      normalize(`${p.firstName} ${p.lastName}`).includes(q) ||
      normalize(p.patientId).includes(q) ||
      normalize(p.contactNumber).includes(q)
    );
  });

  const paginatedPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading) {
    return (
      <Typography align="center" mt={6}>
        Loading patients…
      </Typography>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <HeaderRow>
        <Typography variant="h5">Patient Management</Typography>

        <SearchBox
          size="small"
          placeholder="Search by name and mobile number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button
          component={Link}
          to="/patients/add"
          variant="contained"
          color="primary"
        >
          Add Patient
        </Button>
      </HeaderRow>

      {error && <Alert severity="error">{error}</Alert>}

      {filteredPatients.length === 0 ? (
        <Alert severity="info">No patients found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{maxHeight:800}}>
          <Table >
            <StyledTableHead>
              <TableRow sx={{ backgroundColor: "#000000" }}>
                <StyledHeaderCell>ID</StyledHeaderCell>
                <StyledHeaderCell>Name</StyledHeaderCell>
                <StyledHeaderCell>Age</StyledHeaderCell>
                <StyledHeaderCell>Gender</StyledHeaderCell>
                <StyledHeaderCell>Contact</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedPatients.map((p) => (
                <StyledRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    {p.firstName} {p.lastName}
                  </TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.contactNumber}</TableCell>
                  <TableCell>
                    <ActionsWrapper>
                      <Tooltip title="View Patient">
                        <IconButton
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/patients/history/${p.id}`}
                        >
                          <FaEye fontSize="large" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Patient">
                        <IconButton
                          size="small"
                          sx={{ color: "#FOFOFO", "&:hover": { transform: "scale(1.2)" } }}                         
                          component={Link}
                          to={`/patients/edit/${p.id}`}
                        >
                          <FaEdit fontSize="large" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Patient">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FaTrash fontSize="large" />
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
            count={filteredPatients.length}
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
    </PageContainer>
  );
};

export default PatientList;
