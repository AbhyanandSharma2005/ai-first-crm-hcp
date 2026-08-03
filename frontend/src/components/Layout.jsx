// import React from "react";
// import { Box, useTheme } from "@mui/material";
// import { Outlet } from "react-router-dom";

// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import { layout, mainContentSx } from "../config/layout";
// import { useTheme as useCustomTheme } from "../context/ThemeContext";

// function Layout() {
//   const theme = useTheme();
//   const { mode } = useCustomTheme();
//   const isDark = mode === 'dark';

//   return (
//     <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       <Header />
//       <Sidebar />

//       <Box
//         component="main"
//         sx={{
//           ...mainContentSx,
//           backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
//           mt: `${layout.headerHeight}px`,
//           height: `calc(100vh - ${layout.headerHeight}px)`,
//           overflowY: "auto",
//         }}
//       >
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }

// export default Layout;