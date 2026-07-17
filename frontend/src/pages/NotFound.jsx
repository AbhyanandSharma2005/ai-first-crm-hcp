import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "65vh",
        display: "grid",
        placeItems: "center",
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 580,
          overflow: "hidden",
          borderRadius: 4,
          border: "1px solid #E7ECF5",
          boxShadow: "0 16px 36px rgba(15, 23, 42, .08)",
        }}
      >
        <Box
          sx={{
            height: 8,
            background:
              "linear-gradient(90deg, #2855D9 0%, #8B5CF6 50%, #10A683 100%)",
          }}
        />

        <CardContent
          sx={{
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2.5,
              borderRadius: 3,
              bgcolor: "#EEF4FF",
              color: "#2855D9",
            }}
          >
            <SearchOffRoundedIcon sx={{ fontSize: 38 }} />
          </Box>

          <Typography
            variant="overline"
            sx={{
              color: "#2855D9",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            PAGE NOT FOUND
          </Typography>

          <Typography
            variant="h2"
            sx={{
              mt: 0.5,
              color: "#172033",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: { xs: "3.5rem", sm: "5rem" },
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            fontWeight={750}
            color="#27364D"
            sx={{ mt: 2 }}
          >
            This page is not available
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1.25, maxWidth: 360, mx: "auto", lineHeight: 1.7 }}
          >
            The page may have moved, been removed, or the address may be
            incorrect. Return to your dashboard to continue working.
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeRoundedIcon />}
            sx={{
              mt: 3.5,
              px: 3,
              py: 1.25,
              bgcolor: "#2855D9",
              boxShadow: "0 10px 20px rgba(40,85,217,.22)",
              "&:hover": {
                bgcolor: "#1F46BA",
              },
            }}
          >
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotFound;