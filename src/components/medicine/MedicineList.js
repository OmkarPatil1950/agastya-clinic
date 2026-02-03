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
  Chip,
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
  backgroundColor: "#e8f5e9",
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  backgroundColor: "#66bb6a",
  fontWeight: 600,
  color: "#1b5e20",
}));

const StyledRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#f1f8f4",
  },
}));

const SearchBox = styled(TextField)(() => ({
  minWidth: 300,
  backgroundColor: "#fff",
}));

const ActionsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: 6,
}));

/* ================= component ================= */

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [query]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.getAllMedicines();
      setMedicines(res.data);
      setError(null);
    } catch (e) {
      setError("Unable to load medicines.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine permanently?")) return;

    try {
      await api.deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError("Failed to delete medicine beacause it is given as prescription");
    }
  };

  /* ================= filtering ================= */

  const normalize = (v) => (v || "").toLowerCase();

  const filteredMedicines = medicines.filter((m) => {
    const q = normalize(query);
    if (!q) return true;

    return (
      normalize(m.name).includes(q) ||
      normalize(m.manufacturer).includes(q) ||
      normalize(m.category).includes(q)
    );
  });

  const paginatedMedicines = filteredMedicines.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Typography align="center" mt={6}>
        Loading medicines…
      </Typography>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <HeaderRow>
        <Typography variant="h5" color="#1b5e20">
          Medicine Management
        </Typography>

        <SearchBox
          size="small"
          placeholder="Search by name, category, manufacturer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button
          component={Link}
          to="/medicines/add"
          variant="contained"
          sx={{
            backgroundColor: "#2e7d32",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
        >
          Add Medicine
        </Button>
      </HeaderRow>

      {error && <Alert severity="error">{error}</Alert>}

      {filteredMedicines.length === 0 ? (
        <Alert severity="info">No medicines found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell>ID</StyledHeaderCell>
                <StyledHeaderCell>Name</StyledHeaderCell>
                <StyledHeaderCell>Manufacturer</StyledHeaderCell>
                <StyledHeaderCell>Category</StyledHeaderCell>
                <StyledHeaderCell>Status</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {paginatedMedicines.map((m) => (
                <StyledRow key={m.id}>
                  <TableCell>{m.id}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.manufacturer}</TableCell>
                  <TableCell>{m.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={m.isActive ? "Active" : "Inactive"}
                      color={m.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <ActionsWrapper>

                      <Tooltip title="Edit Medicine">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#2e7d32",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                          component={Link}
                          to={`/medicines/edit/${m.id}`}
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Medicine">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(m.id)}
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
            count={filteredMedicines.length}
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

export default MedicineList;
