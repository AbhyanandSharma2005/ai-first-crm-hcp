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
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import TablePagination from "@mui/material/TablePagination";

function RecentInteractionsTable({ interactions = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search doctor, product or summary..."
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setPage(0);
        }}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#E7ECF5",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F8FAFD" }}>
              <TableCell sx={headerCellSx}>HCP</TableCell>
              <TableCell sx={headerCellSx}>Product</TableCell>
              <TableCell sx={headerCellSx}>Interaction summary</TableCell>
              <TableCell sx={headerCellSx}>Follow-up</TableCell>
              <TableCell sx={headerCellSx} align="right">
                Record
              </TableCell>
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
                <TableCell sx={{ py: 1.75 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: 13,
                        fontWeight: 800,
                        bgcolor: "#EAF0FF",
                        color: "#2855D9",
                      }}
                    >
                      {(item.hcp_name || "H").charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700} color="#27364D">
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape
                          textToHighlight={item.hcp_name || "Unknown HCP"}
                        />
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Healthcare professional
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      <Highlighter
                        searchWords={[searchTerm]}
                        autoEscape
                        textToHighlight={item.product || "Not specified"}
                      />
                    }
                    size="small"
                    sx={{
                      bgcolor: "#EEF4FF",
                      color: "#2855D9",
                      borderRadius: 1.5,
                      fontWeight: 700,
                    }}
                  />
                </TableCell>

                <TableCell sx={{ maxWidth: 320 }}>
                  <Typography
                    variant="body2"
                    color="#526176"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      lineHeight: 1.55,
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

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CalendarMonthOutlinedIcon
                      sx={{ color: "#8A98AB", fontSize: 18 }}
                    />

                    <Typography variant="body2" color="#526176">
                      <Highlighter
                        searchWords={[searchTerm]}
                        autoEscape
                        textToHighlight={formatDate(item.follow_up)}
                      />
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Chip
                    label={`#${item.id ?? "\u2014"}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#D9E1F2",
                      color: "#64748B",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {filteredInteractions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No interactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredInteractions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
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