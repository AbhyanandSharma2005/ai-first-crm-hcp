import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Sidebar width constant
const DRAWER_WIDTH = 264;

function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header onMenuToggle={handleDrawerToggle} />
            
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    mt: "64px", // Header height offset
                }}
            >
                {/* Desktop Sidebar */}
                <Sidebar />
                
                {/* Mobile Sidebar Drawer */}
                <Box
                    component="nav"
                    sx={{
                        width: { md: DRAWER_WIDTH },
                        flexShrink: { md: 0 },
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {/* Mobile drawer implementation if needed */}
                </Box>
                
                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: {
                            md: `calc(100% - ${DRAWER_WIDTH}px)`,
                        },
                        ml: {
                            md: `${DRAWER_WIDTH}px`,
                        },
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        minHeight: "calc(100vh - 64px)",
                        backgroundColor: theme.palette.background.default,
                        transition: theme.transitions.create(["margin", "width"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;