import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

function RecentInteractionsTable({ interactions = [] }) {
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
          {interactions.map((item, index) => (
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
                      {item.hcp_name || "Unknown HCP"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Healthcare professional
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  label={item.product || "Not specified"}
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
                  {item.summary || "No interaction summary recorded."}
                </Typography>
              </TableCell>

              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CalendarMonthOutlinedIcon
                    sx={{ color: "#8A98AB", fontSize: 18 }}
                  />

                  <Typography variant="body2" color="#526176">
                    {formatDate(item.follow_up)}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Chip
                  label={`#${item.id ?? "—"}`}
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
        </TableBody>
      </Table>
    </TableContainer>
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