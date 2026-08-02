import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import LoadingTable from "./LoadingTable";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import LoadingButton from "@mui/lab/LoadingButton";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing } from "../theme/theme";
import EmptyState from "./EmptyState";
import AppSnackbar from "../components/AppSnackbar";

// Reusable button style object with focus visibility
const buttonSx = {
  borderRadius: 3,
  px: 3,
  py: 1.2,
  textTransform: "none",
  fontWeight: 600,
  transition: "all .25s ease",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0,0,0,.15)"
  },
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Reusable card animation with reduced motion support and focus visibility
const cardAnimation = {
  transition: "all 0.3s ease-in-out",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    transform: "none"
  },
  "&:hover": {
    transform: "translateY(-6px) scale(1.01)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.18)"
  },
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Focus visibility for interactive elements
const focusVisibleSx = {
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

function SearchHCP() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';

  const [doctorName, setDoctorName] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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

  // Validation function
  const validateSearch = () => {
    const query = doctorName.trim();
    
    if (!query) {
      setSearchError("Doctor name is required");
      showSnackbar("warning", "Please enter a doctor name.");
      return false;
    }
    
    setSearchError("");
    return true;
  };

  // Clear error while typing
  const handleDoctorNameChange = (event) => {
    const value = event.target.value;
    setDoctorName(value);
    if (searchError) {
      setSearchError("");
    }
  };

  const searchDoctor = async () => {
    // Validate before search
    if (!validateSearch()) {
      return;
    }

    const query = doctorName.trim();

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    try {
      const response = await API.get("/hcp/search", {
        params: { doctor_name: query },
      });

      if (response.data?.success && Array.isArray(response.data?.data)) {
        const fetchedResults = response.data.data;
        setResults(fetchedResults);
        if (fetchedResults.length === 0) {
          showSnackbar("info", "No matching doctor found.");
        } else {
          showSnackbar("success", "Doctor found successfully.");
        }
      } else {
        const errorMsg = response.data?.message ||
          "No healthcare professionals matched your search.";
        setError(errorMsg);
        showSnackbar("info", "No matching doctor found.");
      }
    } catch (err) {
      console.error("HCP search failed:", err);
      const errorMsg = err.response?.data?.message ||
        "Unable to search healthcare professionals. Please try again.";
      setError(errorMsg);
      showSnackbar("error", "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchDoctor();
    }
  };

  const clearSearch = () => {
    setDoctorName("");
    setResults([]);
    setHasSearched(false);
    setError("");
    setSearchError("");
    showSnackbar("success", "Search cleared successfully.");
  };

  const headerCellSx = {
    py: 1.5,
    color: "#475569", // Improved contrast
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderColor: borderColor,
  };

  if (loading) {
    return <LoadingTable rows={5} />;
  }

  return (
    <Card
      tabIndex={0}
      role="article"
      aria-label="Search Healthcare Professionals"
      sx={{
        borderRadius: 4,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 8px 25px rgba(15,23,42,.08)",
        backgroundColor: cardBg,
        ...cardAnimation,
      }}
    >
      <CardContent 
        sx={{ 
          p: { xs: 2.5, md: 3.5 },
          transition: "all .3s",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none"
          },
          ".MuiTypography-root": {
            transition: "all .25s",
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none"
            }
          }
        }}
      >
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
            aria-label="Search icon"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: avatarBg,
              color: avatarColor,
              transition: "all .3s",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none"
              },
              "&:hover": {
                transform: "scale(1.1) rotate(-5deg)",
              },
              ...focusVisibleSx,
            }}
          >
            <PersonSearchOutlinedIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700} color={textPrimary}>
              Search healthcare professionals
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                mt: 0.25,
                color: "#475569" // Improved contrast
              }}
            >
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
            onChange={handleDoctorNameChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Search doctor name..."
            size="medium"
            error={Boolean(searchError)}
            helperText={searchError}
            required
            inputProps={{
              "aria-label": "Search Healthcare Professional"
            }}
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
              ...focusVisibleSx,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: isDark ? "#94A3B8" : "#718096" }} />
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            variant="contained"
            color="primary"
            size="large"
            onClick={searchDoctor}
            loading={loading}
            disabled={loading || !doctorName.trim()}
            loadingPosition="start"
            startIcon={<SearchRoundedIcon />}
            aria-label="Search HCP"
            sx={{
              ...buttonSx,
              minWidth: { xs: "100%", sm: 140 },
              bgcolor: "#2855D9",
              boxShadow: "0 8px 16px rgba(40,85,217,.2)",
              transition: "all .25s",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none"
              },
              "&:hover": {
                bgcolor: "#1F46BA",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(40,85,217,.3)",
              },
              "&.Mui-disabled": {
                bgcolor: isDark ? "#334155" : "#E2E8F0",
              },
            }}
          >
            Search
          </LoadingButton>
        </Box>

        {/* Keep persistent error display - this is page state */}
        {error && (
          <Alert
            severity="info"
            aria-label="Search error"
            sx={{
              mb: 3,
              borderRadius: 2.5,
              border: `1px solid ${isDark ? '#334155' : '#B8D4FF'}`,
              bgcolor: isDark ? '#1A2A4A' : '#F2F8FF',
              color: isDark ? '#60A5FA' : '#255FA8',
              ...focusVisibleSx,
            }}
          >
            {error}
          </Alert>
        )}

        {!hasSearched && !loading && !error && (
          <Box
            tabIndex={0}
            role="img"
            aria-label="Search your HCP directory"
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
              transition: "all .3s",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none"
              },
              "&:hover": {
                transform: "scale(1.02)",
              },
              ...focusVisibleSx,
            }}
          >
            <Box>
              <SearchRoundedIcon sx={{ color: isDark ? "#475569" : "#A0AEC0", fontSize: 30, mb: 1 }} />
              <Typography fontWeight={700} color={isDark ? "#94A3B8" : "#475569"}>
                Search your HCP directory
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 0.5,
                  color: "#475569" // Improved contrast
                }}
              >
                Enter a doctor name to find their profile and hospital details.
              </Typography>
            </Box>
          </Box>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <EmptyState
            icon={SearchOffOutlinedIcon}
            title="No Doctors Found"
            description="Try another doctor name or clear the filters."
            actionLabel="Clear Search"
            onAction={clearSearch}
          />
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
              <Typography 
                variant="body2" 
                sx={{ color: "#475569" }} // Improved contrast
              >
                Search results
              </Typography>

              <Chip
                label={`${results.length} ${results.length === 1 ? "record" : "records"}`}
                size="small"
                color="primary"
                variant="outlined"
                aria-label={`${results.length} ${results.length === 1 ? "record" : "records"} found`}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  ...focusVisibleSx,
                }}
              />
            </Box>

            <TableContainer
              component={Paper}
              variant="outlined"
              aria-label="Search Results"
              sx={{
                borderRadius: 3,
                borderColor: borderColor,
                overflowX: "auto",
                backgroundColor: cardBg,
                transition: "all .3s",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none"
                },
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(15,23,42,.12)",
                },
                ...focusVisibleSx,
              }}
            >
              <Table 
                aria-label="Healthcare Professional Search Results"
                sx={{ minWidth: 650 }}
              >
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
                      tabIndex={0}
                      role="row"
                      aria-label={`Healthcare Professional: ${doctor.name || "Unknown"}`}
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: rowHoverBg },
                        transition: "all .2s",
                        "@media (prefers-reduced-motion: reduce)": {
                          transition: "none"
                        },
                        ...focusVisibleSx,
                      }}
                    >
                      <TableCell sx={{ py: 1.75 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <Avatar
                            aria-label={`${doctor.name || "Unknown"} avatar`}
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: avatarBg,
                              color: avatarColor,
                              borderRadius: 3,
                              transition: "all .3s",
                              "@media (prefers-reduced-motion: reduce)": {
                                transition: "none"
                              },
                              "&:hover": {
                                transform: "scale(1.1) rotate(-5deg)",
                              },
                              ...focusVisibleSx,
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
                            aria-label="Hospital"
                            sx={{ 
                              color: isDark ? "#475569" : "#8A98AB", 
                              fontSize: 18,
                              transition: "all .3s",
                              "@media (prefers-reduced-motion: reduce)": {
                                transition: "none"
                              },
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                              ...focusVisibleSx,
                            }}
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
                          aria-label={`Record ID ${doctor.id}`}
                          sx={{
                            bgcolor: isDark ? '#1E293B' : '#F1F5F9',
                            color: isDark ? '#94A3B8' : '#526176',
                            fontWeight: 700,
                            borderRadius: 2,
                            transition: "all .3s",
                            "@media (prefers-reduced-motion: reduce)": {
                              transition: "none"
                            },
                            "&:hover": {
                              transform: "scale(1.05)",
                              bgcolor: isDark ? '#334155' : '#E2E8F0',
                            },
                            ...focusVisibleSx,
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

      {/* App Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleSnackbarClose}
      />
    </Card>
  );
}

export default SearchHCP;