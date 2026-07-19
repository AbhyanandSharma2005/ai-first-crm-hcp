import {
  Avatar,
  Box,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import TablePagination from "@mui/material/TablePagination";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

function RecentInteractionsTable({ interactions = [] }) {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [interactions]);

  // Update rows per page on mobile
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  const keyword = searchTerm.trim().toLowerCase();

  const filteredInteractions = interactions.filter((interaction) => {
    const followUp = interaction.follow_up ? String(interaction.follow_up) : "";

    return (
      interaction.hcp_name?.toLowerCase().includes(keyword) ||
      interaction.product?.toLowerCase().includes(keyword) ||
      interaction.summary?.toLowerCase().includes(keyword) ||
      followUp.toLowerCase().includes(keyword) ||
      formatDate(followUp).toLowerCase().includes(keyword)
    );
  });

  const paginatedInteractions = filteredInteractions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Theme colors
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textSecondary = isDark ? "#94A3B8" : "#475569";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const headerBg = isDark ? "#0F172A" : "#F8FAFD";
  const rowHoverBg = isDark ? "#1E293B" : "#FAFCFF";
  const emptyBg = isDark ? "#1E293B" : "#FAFBFD";
  const emptyBorder = isDark ? "#334155" : "#D9E1F2";
  const avatarBg = isDark ? "#1A2A4A" : "#EAF0FF";
  const avatarColor = isDark ? "#60A5FA" : "#2855D9";
  const chipBg = isDark ? "#1A2A4A" : "#EEF4FF";
  const chipColor = isDark ? "#60A5FA" : "#2855D9";

  if (!interactions.length) {
    return (
      <Box
        sx={{
          minHeight: 170,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          border: `1px dashed ${emptyBorder}`,
          borderRadius: 3,
          bgcolor: emptyBg,
          px: 3,
          py: 4,
        }}
      >
        <Box>
          <EventNoteOutlinedIcon
            sx={{ fontSize: 32, color: textSecondary, mb: 1 }}
          />

          <Typography fontWeight={700} color={textPrimary}>
            No recent interactions
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            New HCP interaction records will appear here.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Responsive table columns - hide some columns on mobile
  const showProductColumn = !isMobile;
  const showFollowupColumn = !isMobile;
  const showRecordColumn = !isTablet;

  // Responsive chip sizes
  const chipSize = isMobile ? "small" : "medium";

  const headerCellSx = {
    py: 1.5,
    color: textSecondary,
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderColor: borderColor,
  };

  return (
    <Box>
      {/* ============================================================
      Responsive Search Field
      ============================================================ */}
      <TextField
        fullWidth
        size={isMobile ? "small" : "medium"}
        placeholder={isMobile ? "Search..." : "Search doctor, product or summary..."}
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setPage(0);
        }}
        sx={{ 
          mb: 3,
          "& .MuiInputBase-root": {
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: textPrimary,
          },
          "& .MuiInputBase-input": {
            py: isMobile ? 1 : 1.5,
          },
          "& .MuiInputLabel-root": {
            color: textSecondary,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: borderColor,
            },
            "&:hover fieldset": {
              borderColor: textSecondary,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: isMobile ? 20 : 24, color: textSecondary }} />
            </InputAdornment>
          ),
        }}
      />

      {/* ============================================================
      Responsive Table
      ============================================================ */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: borderColor,
          overflowX: "auto",
          backgroundColor: cardBg,
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
        <Table sx={{ 
          minWidth: isMobile ? 500 : 650,
          "& .MuiTableCell-root": {
            borderColor: borderColor,
          }
        }}>
          <TableHead>
            <TableRow sx={{ bgcolor: headerBg }}>
              <TableCell sx={headerCellSx}>HCP</TableCell>
              {showProductColumn && (
                <TableCell sx={headerCellSx}>Product</TableCell>
              )}
              <TableCell sx={headerCellSx}>Summary</TableCell>
              {showFollowupColumn && (
                <TableCell sx={headerCellSx}>Follow-up</TableCell>
              )}
              {showRecordColumn && (
                <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>
                  Record
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedInteractions.map((item, index) => (
              <TableRow
                key={item.id ?? index}
                hover
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  "&:hover": { bgcolor: rowHoverBg },
                }}
              >
                <TableCell 
                  sx={{ 
                    py: isMobile ? 1.5 : 1.75,
                    px: isMobile ? 1.5 : 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Avatar
                      sx={{
                        width: {
                          xs: 32,
                          md: 36,
                        },
                        height: {
                          xs: 32,
                          md: 36,
                        },
                        fontSize: {
                          xs: 11,
                          md: 13,
                        },
                        fontWeight: 800,
                        bgcolor: avatarBg,
                        color: avatarColor,
                      }}
                    >
                      {(item.hcp_name || "H").charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography 
                        fontWeight={700} 
                        color={textPrimary}
                        sx={{
                          fontSize: isMobile ? "0.8rem" : "0.875rem"
                        }}
                      >
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape
                          textToHighlight={item.hcp_name || "Unknown HCP"}
                        />
                      </Typography>

                      {!isMobile && (
                        <Typography variant="caption" color="text.secondary">
                          Healthcare professional
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {showProductColumn && (
                  <TableCell sx={{ px: isMobile ? 1.5 : 2 }}>
                    <Chip
                      label={
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape
                          textToHighlight={item.product || "Not specified"}
                        />
                      }
                      size={chipSize}
                      sx={{
                        bgcolor: chipBg,
                        color: chipColor,
                        borderRadius: 1.5,
                        fontWeight: 700,
                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                      }}
                    />
                  </TableCell>
                )}

                <TableCell 
                  sx={{ 
                    maxWidth: isMobile ? 150 : 320,
                    px: isMobile ? 1.5 : 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={textSecondary}
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isMobile ? 2 : 2,
                      lineHeight: 1.55,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    }}
                  >
                    <Highlighter
                      searchWords={[searchTerm]}
                      autoEscape
                      textToHighlight={
                        item.summary || "No interaction summary recorded."
                      }
                    />
                  </Typography>
                </TableCell>

                {showFollowupColumn && (
                  <TableCell sx={{ px: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <CalendarMonthOutlinedIcon
                        sx={{ color: textSecondary, fontSize: isMobile ? 16 : 18 }}
                      />

                      <Typography 
                        variant="body2" 
                        color={textSecondary}
                        sx={{
                          fontSize: isMobile ? "0.75rem" : "0.875rem"
                        }}
                      >
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape
                          textToHighlight={formatDate(item.follow_up)}
                        />
                      </Typography>
                    </Box>
                  </TableCell>
                )}

                {showRecordColumn && (
                  <TableCell align="right" sx={{ px: isMobile ? 1.5 : 2 }}>
                    <Chip
                      label={`#${item.id ?? "\u2014"}`}
                      size={chipSize}
                      variant="outlined"
                      sx={{
                        borderColor: borderColor,
                        color: textSecondary,
                        fontWeight: 700,
                        fontSize: isMobile ? "0.65rem" : "0.75rem",
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}

            {filteredInteractions.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={showRecordColumn ? 5 : (showFollowupColumn ? 4 : 3)} 
                  align="center" 
                  sx={{ py: 4 }}
                >
                  <Typography color="text.secondary">
                    No interactions found matching your search.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ============================================================
      Responsive Pagination
      ============================================================ */}
      <TablePagination
        component="div"
        count={filteredInteractions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={isMobile ? [5, 10, 20] : [5, 10, 20, 50]}
        sx={{
          color: textSecondary,
          "& .MuiTablePagination-selectLabel": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiTablePagination-select": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            color: textPrimary,
          },
          "& .MuiTablePagination-actions": {
            "& .MuiIconButton-root": {
              padding: isMobile ? 0.5 : 1,
              color: textSecondary,
            },
          },
        }}
      />
    </Box>
  );
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default RecentInteractionsTable;