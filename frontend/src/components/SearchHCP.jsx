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
  useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing } from "../theme/theme";

function SearchHCP() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';

  const [doctorName, setDoctorName] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textPrimary = isDark ? "#F1F5F9" : "#172033";
  const textSecondary = isDark ? "#94A3B8" : "#475569";
  const borderColor = isDark ? "#334155" : "#E7ECF5";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const headerBg = isDark ? "#0F172A" : "#F8FAFD";
  const rowHoverBg = isDark ? "#1E293B" : "#FAFCFF";
  const emptyBg = isDark ? "#1E293B" : "#FAFBFD";
  const emptyBorder = isDark ? "#334155" : "#D9E1F2";
  const avatarBg = isDark ? "#1A2A4A" : "#EAF0FF";
  const avatarColor = isDark ? "#60A5FA" : "#2855D9";

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

  const headerCellSx = {
    py: 1.5,
    color: isDark ? "#94A3B8" : "#667085",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderColor: borderColor,
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${borderColor}`,
        boxShadow: 1,
        backgroundColor: cardBg,
        transition: "0.25s",
        "&:hover": {
          boxShadow: 4,
        },
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
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: avatarBg,
              color: avatarColor,
            }}
          >
            <PersonSearchOutlinedIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700} color={textPrimary}>
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
                bgcolor: isDark ? '#0F172A' : '#FFFFFF',
                borderRadius: 2.5,
                "& fieldset": {
                  borderColor: borderColor,
                },
                "&:hover fieldset": {
                  borderColor: isDark ? '#475569' : '#94A3B8',
                },
              },
              "& .MuiInputLabel-root": {
                color: textSecondary,
              },
              "& .MuiInputBase-input": {
                color: textPrimary,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: isDark ? "#94A3B8" : "#718096" }} />
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
              borderRadius: 3,
              px: 3,
              py: 1.25,
              textTransform: "none",
              fontWeight: 700,
              minWidth: { xs: "100%", sm: 140 },
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
              border: `1px solid ${isDark ? '#334155' : '#B8D4FF'}`,
              bgcolor: isDark ? '#1A2A4A' : '#F2F8FF',
              color: isDark ? '#60A5FA' : '#255FA8',
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
              border: `1px dashed ${emptyBorder}`,
              borderRadius: 3,
              bgcolor: emptyBg,
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <SearchRoundedIcon sx={{ color: isDark ? "#475569" : "#A0AEC0", fontSize: 30, mb: 1 }} />
              <Typography fontWeight={700} color={isDark ? "#94A3B8" : "#475569"}>
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
              bgcolor: emptyBg,
              border: `1px dashed ${emptyBorder}`,
            }}
          >
            <Typography fontWeight={700} color={isDark ? "#94A3B8" : "#475569"}>
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
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            </Box>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: borderColor,
                overflowX: "auto",
                backgroundColor: cardBg,
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: headerBg }}>
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
                        "&:hover": { bgcolor: rowHoverBg },
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
                              bgcolor: avatarBg,
                              color: avatarColor,
                              borderRadius: 3,
                            }}
                          >
                            {(doctor.name || "H").charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography fontWeight={700} color={textPrimary}>
                            {doctor.name || "—"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: isDark ? "#94A3B8" : "#526176" }}>
                        {doctor.specialization || "Not specified"}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <LocalHospitalOutlinedIcon
                            sx={{ color: isDark ? "#475569" : "#8A98AB", fontSize: 18 }}
                          />
                          <Typography variant="body2" color={isDark ? "#94A3B8" : "#526176"}>
                            {doctor.hospital || "Not specified"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`#${doctor.id}`}
                          size="small"
                          sx={{
                            bgcolor: isDark ? '#1E293B' : '#F1F5F9',
                            color: isDark ? '#94A3B8' : '#526176',
                            fontWeight: 700,
                            borderRadius: 2,
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

export default SearchHCP;