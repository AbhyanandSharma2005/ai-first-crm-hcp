import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

import API from "../api/api";

function SearchHCP() {
  const [doctorName, setDoctorName] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchDoctor = async () => {
    const query = doctorName.trim();

    if (!query) {
      setError("Enter a healthcare professional's name to search.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    try {
      const response = await API.get("/hcp/search", {
        params: { doctor_name: query },
      });

      if (response.data?.success && Array.isArray(response.data?.data)) {
        setResults(response.data.data);
      } else {
        setError(
          response.data?.message ||
            "No healthcare professionals matched your search."
        );
      }
    } catch (err) {
      console.error("HCP search failed:", err);
      setError(
        err.response?.data?.message ||
          "Unable to search healthcare professionals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") searchDoctor();
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #E7ECF5",
        boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              bgcolor: "#EAF0FF",
              color: "#2855D9",
            }}
          >
            <PersonSearchOutlinedIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={750} color="#172033">
              Search healthcare professionals
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Find HCP records by doctor name and review profile details.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            value={doctorName}
            onChange={(event) => setDoctorName(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Search by doctor name, e.g. Dr. Sharma"
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#FFFFFF",
                borderRadius: 2.5,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "#718096" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={searchDoctor}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                <SearchRoundedIcon />
              )
            }
            sx={{
              minWidth: { xs: "100%", sm: 140 },
              px: 2.5,
              borderRadius: 2.5,
              bgcolor: "#2855D9",
              boxShadow: "0 8px 16px rgba(40,85,217,.2)",
              "&:hover": { bgcolor: "#1F46BA" },
            }}
          >
            {loading ? "Searching" : "Search"}
          </Button>
        </Box>

        {error && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2.5,
              border: "1px solid #B8D4FF",
              bgcolor: "#F2F8FF",
              color: "#255FA8",
            }}
          >
            {error}
          </Alert>
        )}

        {!hasSearched && !loading && !error && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 160,
              border: "1px dashed #D9E1F2",
              borderRadius: 3,
              bgcolor: "#FAFBFD",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <SearchRoundedIcon sx={{ color: "#A0AEC0", fontSize: 30, mb: 1 }} />
              <Typography fontWeight={650} color="#475569">
                Search your HCP directory
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter a doctor name to find their profile and hospital details.
              </Typography>
            </Box>
          </Box>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              borderRadius: 3,
              bgcolor: "#FAFBFD",
              border: "1px dashed #D9E1F2",
            }}
          >
            <Typography fontWeight={700} color="#475569">
              No matching HCPs found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Try another spelling or a more general name.
            </Typography>
          </Box>
        )}

        {results.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Search results
              </Typography>

              <Chip
                label={`${results.length} ${results.length === 1 ? "record" : "records"}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "#E7ECF5",
                overflowX: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8FAFD" }}>
                    <TableCell sx={headerCellSx}>HCP</TableCell>
                    <TableCell sx={headerCellSx}>Specialization</TableCell>
                    <TableCell sx={headerCellSx}>Hospital</TableCell>
                    <TableCell sx={headerCellSx}>Record ID</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {results.map((doctor) => (
                    <TableRow
                      key={doctor.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: "#FAFCFF" },
                      }}
                    >
                      <TableCell sx={{ py: 1.75 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: "#EAF0FF",
                              color: "#2855D9",
                            }}
                          >
                            {(doctor.name || "H").charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography fontWeight={650} color="#26354D">
                            {doctor.name || "—"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: "#526176" }}>
                        {doctor.specialization || "Not specified"}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <LocalHospitalOutlinedIcon
                            sx={{ color: "#8A98AB", fontSize: 18 }}
                          />
                          <Typography variant="body2" color="#526176">
                            {doctor.hospital || "Not specified"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`#${doctor.id}`}
                          size="small"
                          sx={{
                            bgcolor: "#F1F5F9",
                            color: "#526176",
                            fontWeight: 650,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

const headerCellSx = {
  py: 1.5,
  color: "#667085",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderColor: "#E7ECF5",
};

export default SearchHCP;