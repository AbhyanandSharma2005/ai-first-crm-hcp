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

function RecentInteractionsTable({ interactions = [] }) {
  const theme = useTheme();
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

  if (!interactions.length) {
    return (
      <Box
        sx={{
          minHeight: 170,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          border: "1px dashed #D9E1F2",
          borderRadius: 3,
          bgcolor: "#FAFBFD",
          px: 3,
          py: 4,
        }}
      >
        <Box>
          <EventNoteOutlinedIcon
            sx={{ fontSize: 32, color: "#9AA8BA", mb: 1 }}
          />

          <Typography fontWeight={700} color="#475569">
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
          },
          "& .MuiInputBase-input": {
            py: isMobile ? 1 : 1.5,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
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
          borderColor: "#E7ECF5",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F1F5F9",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#CBD5E1",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#94A3B8",
          },
        }}
      >
        <Table sx={{ 
          minWidth: isMobile ? 500 : 650,
          "& .MuiTableCell-root": {
            borderColor: "#E7ECF5",
          }
        }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F8FAFD" }}>
              <TableCell sx={headerCellSx}>HCP</TableCell>
              {showProductColumn && (
                <TableCell sx={headerCellSx}>Product</TableCell>
              )}
              <TableCell sx={headerCellSx}>Summary</TableCell>
              {showFollowupColumn && (
                <TableCell sx={headerCellSx}>Follow-up</TableCell>
              )}
              {showRecordColumn && (
                <TableCell sx={headerCellSx} align="right">
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
                  "&:hover": { bgcolor: "#FAFCFF" },
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
                        bgcolor: "#EAF0FF",
                        color: "#2855D9",
                      }}
                    >
                      {(item.hcp_name || "H").charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography 
                        fontWeight={700} 
                        color="#27364D"
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
                        bgcolor: "#EEF4FF",
                        color: "#2855D9",
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
                    color="#526176"
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
                        sx={{ color: "#8A98AB", fontSize: isMobile ? 16 : 18 }}
                      />

                      <Typography 
                        variant="body2" 
                        color="#526176"
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
                        borderColor: "#D9E1F2",
                        color: "#64748B",
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
          "& .MuiTablePagination-selectLabel": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiTablePagination-select": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiTablePagination-actions": {
            "& .MuiIconButton-root": {
              padding: isMobile ? 0.5 : 1,
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

const headerCellSx = {
  py: 1.5,
  color: "#667085",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderColor: "#E7ECF5",
};

export default RecentInteractionsTable;