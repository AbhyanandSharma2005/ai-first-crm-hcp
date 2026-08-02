import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchIcon from "@mui/icons-material/Search";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import EditInteraction from "./EditInteraction";
import AppSnackbar from "../components/AppSnackbar";
import { commonSpacing } from "../theme/theme";
import LoadingTable from "./LoadingTable";
import EmptyState from "./EmptyState";

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

// Outlined button style
const outlinedButtonSx = {
  ...buttonSx,
  borderWidth: 2,
  "&:hover": {
    borderWidth: 2,
    transform: "translateY(-2px)"
  }
};

// Icon button style with focus visibility
const iconButtonSx = {
  transition: ".25s",
  "&:hover": {
    transform: "scale(1.08)",
    bgcolor: "action.hover"
  },
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Focus visibility for cards and containers
const focusVisibleSx = {
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

function InteractionHistory() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';

  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  const emptyBg = isDark ? "#0F172A" : "#FAFBFD";
  const chipBg = isDark ? "#1A2A4A" : "#EEF4FF";
  const chipColor = isDark ? "#60A5FA" : "#2855D9";

  const fetchInteractions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await API.get("/interaction/");
      console.log("Interaction History:", response.data);

      if (Array.isArray(response.data)) {
        setInteractions(response.data);
      } else if (Array.isArray(response.data.data)) {
        setInteractions(response.data.data);
      } else {
        setInteractions([]);
      }
      setError("");
      if (isRefresh) {
        showSnackbar("success", "Interaction history refreshed successfully.");
      }
    } catch (err) {
      console.error("Error fetching interactions:", err);
      const errorMessage = err.response?.data?.message ||
        "Unable to load interaction history.";
      setError(errorMessage);
      showSnackbar("error", "Unable to load interaction history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const openEdit = (interaction) => {
    setSelectedInteraction(interaction);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setSelectedInteraction(null);
    setShowEdit(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await API.delete(`/interaction/${deleteId}`);
      if (response.data?.success) {
        showSnackbar("success", "Interaction deleted.");
        await fetchInteractions(true);
      } else {
        showSnackbar("error", "Failed to delete interaction.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete interaction.");
      showSnackbar("error", "Failed to delete interaction.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredInteractions = interactions.filter((interaction) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;
    
    return (
      interaction.hcp_name?.toLowerCase().includes(keyword) ||
      interaction.product?.toLowerCase().includes(keyword) ||
      interaction.summary?.toLowerCase().includes(keyword) ||
      String(interaction.id).includes(keyword)
    );
  });

  const headerCellSx = {
    py: 1.5,
    color: "#475569", // Improved contrast
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderColor: borderColor,
  };

  const tableCellSx = {
    borderColor: borderColor,
    color: textPrimary,
  };

  if (loading) {
    return <LoadingTable rows={8} />;
  }

  // Keep persistent error display (page state), but snackbar already handles the transient notification
  if (error) {
    return (
      <Box>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            border: `1px solid ${isDark ? '#334155' : '#FFCDD2'}`,
            bgcolor: isDark ? '#1A1A2E' : '#FFEBEE',
            ...focusVisibleSx,
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Retry loading interactions"
          onClick={() => fetchInteractions()}
          sx={buttonSx}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Refresh Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search interactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="medium"
          inputProps={{
            "aria-label": "Search Interaction"
          }}
          sx={{
            flex: { xs: "1 1 100%", sm: "0 1 300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              "& fieldset": {
                borderColor: borderColor,
              },
              "&:hover fieldset": {
                borderColor: textSecondary,
              },
            },
            "& .MuiInputBase-input": {
              color: textPrimary,
            },
            "&:focus-visible": {
              outline: "3px solid #1976D2",
              outlineOffset: 2,
              borderRadius: 6
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#475569" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ color: "#475569" }} // Improved contrast
          >
            {filteredInteractions.length} of {interactions.length} interactions
          </Typography>

          <Tooltip title="Refresh Interactions">
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={() => fetchInteractions(true)}
              disabled={refreshing}
              aria-label="Refresh Interactions"
              sx={{
                ...outlinedButtonSx,
                borderColor: borderColor,
                color: textSecondary,
                "&:hover": {
                  borderColor: textPrimary,
                  color: textPrimary,
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                },
              }}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {filteredInteractions.length === 0 ? (
        <EmptyState
          icon={<HistoryOutlinedIcon />}
          title="No Interaction History"
          description="Interactions logged through forms or AI chat will appear here."
        />
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          aria-label="Interaction History"
          sx={{
            borderRadius: 3,
            borderColor: borderColor,
            overflowX: "auto",
            backgroundColor: cardBg,
            ...focusVisibleSx,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isDark ? "#334155" : "#CBD5E1",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: isDark ? "#475569" : "#94A3B8",
            },
          }}
        >
          <Table 
            aria-label="Interaction History"
            sx={{ minWidth: 650 }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: headerBg }}>
                <TableCell sx={headerCellSx}>ID</TableCell>
                <TableCell sx={headerCellSx}>HCP Name</TableCell>
                <TableCell sx={headerCellSx}>Summary</TableCell>
                <TableCell sx={headerCellSx}>Product</TableCell>
                <TableCell sx={headerCellSx}>Follow Up</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredInteractions.map((interaction) => (
                <TableRow
                  key={interaction.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    "&:hover": { bgcolor: rowHoverBg },
                    ...focusVisibleSx,
                  }}
                >
                  <TableCell sx={{ ...tableCellSx, fontWeight: 600 }}>
                    #{interaction.id}
                  </TableCell>
                  <TableCell sx={tableCellSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={600} color={textPrimary}>
                        {interaction.hcp_name || "—"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...tableCellSx, maxWidth: 200 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {interaction.summary || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tableCellSx}>
                    {interaction.product ? (
                      <Chip
                        label={interaction.product}
                        size="small"
                        sx={{
                          bgcolor: chipBg,
                          color: chipColor,
                          fontWeight: 700,
                          borderRadius: 2,
                          ...focusVisibleSx,
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell sx={tableCellSx}>
                    {formatDate(interaction.follow_up)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit interaction">
                      <IconButton
                        color="warning"
                        size="large"
                        aria-label="Edit Interaction"
                        title="Edit"
                        onClick={() => openEdit(interaction)}
                        sx={{
                          ...iconButtonSx,
                          color: textSecondary,
                          "&:hover": {
                            color: "#ED6C02",
                            bgcolor: chipBg,
                            transform: "scale(1.08)",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete interaction">
                      <IconButton
                        color="error"
                        size="large"
                        aria-label="Delete Interaction"
                        title="Delete"
                        onClick={() => openDeleteDialog(interaction.id)}
                        sx={{
                          ...iconButtonSx,
                          color: textSecondary,
                          "&:hover": {
                            color: "#EF4444",
                            bgcolor: isDark ? "#2A1A1A" : "#FFEBEE",
                            transform: "scale(1.08)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      {showEdit && (
        <EditInteraction
          interaction={selectedInteraction}
          onClose={closeEdit}
          onUpdate={() => {
            showSnackbar("success", "Interaction updated.");
            fetchInteractions(true);
            closeEdit();
          }}
          onError={(message) => {
            showSnackbar("error", message || "Failed to update interaction.");
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            ...focusVisibleSx,
          },
        }}
      >
        <DialogTitle sx={{ color: textPrimary }}>
          Delete Interaction
        </DialogTitle>
        <DialogContent>
          <Typography 
            variant="body2" 
            sx={{ color: "#475569" }} // Improved contrast
          >
            Are you sure you want to delete this interaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            size="medium"
            aria-label="Cancel delete"
            sx={{
              ...buttonSx,
              color: textSecondary,
              "&:hover": {
                bgcolor: isDark ? "#1E293B" : "#F1F5F9",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(0,0,0,.15)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            size="large"
            aria-label="Confirm delete"
            sx={{
              ...buttonSx,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* App Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default InteractionHistory;