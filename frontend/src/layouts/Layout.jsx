import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { layout, mainContentSx } from "../theme/layout";

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
                    mt: `${layout.headerHeight}px`,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Desktop Sidebar - Fixed position */}
                <Sidebar />
                
                {/* Main Content - Offset to the right of fixed sidebar */}
                <Box
                    component="main"
                    sx={{
                        ...mainContentSx,
                        backgroundColor: theme.palette.background.default,
                        minHeight: `calc(100vh - ${layout.headerHeight}px)`,
                        // The ml and width are now handled by mainContentSx
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;