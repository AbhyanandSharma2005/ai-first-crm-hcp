import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

const drawerWidth = 264;

function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#F5F7FB",
        }}
      >
        <Header />

        <Toolbar
          sx={{
            minHeight: { xs: 0, md: 14 },
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 1520,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 3, md: 5 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;