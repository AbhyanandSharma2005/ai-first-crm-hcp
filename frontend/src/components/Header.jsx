import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Reusable style object
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
  // Focus visibility
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Icon button hover styles
const iconButtonSx = {
  transition: ".25s",
  "&:hover": {
    transform: "scale(1.08)",
    bgcolor: "action.hover"
  },
  // Focus visibility
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

function Header({ onMenuToggle }) {
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Avatar hover styles with focus visibility
  const avatarSx = {
    width: {
      xs: 32,
      sm: 36,
      md: 40,
    },
    height: {
      xs: 32,
      sm: 36,
      md: 40,
    },
    bgcolor: theme.palette.primary.main,
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
    },
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 4px 12px ${theme.palette.primary.main}50`,
    },
    "&:focus-visible": {
      outline: "3px solid #1976D2",
      outlineOffset: 2,
      borderRadius: 6
    }
  };

  return (
    <AppBar
      component="header"
      role="banner"
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: 1200,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 72,
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* Left Section - Logo and Menu Toggle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {isMobile && onMenuToggle && (
            <Tooltip title="Toggle Menu">
              <IconButton
                edge="start"
                color="primary"
                size="large"
                aria-label="Toggle Menu"
                title="Toggle Menu"
                onClick={onMenuToggle}
                sx={{
                  mr: 1,
                  color: theme.palette.text.secondary,
                  ...buttonSx,
                  ...iconButtonSx,
                  px: 1,
                  py: 1,
                  "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: "none",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          <Typography
            variant={isMobile ? "body1" : "h6"}
            fontWeight="700"
            aria-label="AI First CRM Logo"
            role="img"
            sx={{
              color: theme.palette.text.primary,
              fontSize: {
                xs: "0.95rem",
                sm: "1.1rem",
                md: "1.25rem",
              },
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            AI-First CRM
            {!isMobile && (
              <Box
                component="span"
                sx={{
                  fontWeight: 400,
                  color: "#475569", // Improved contrast
                  ml: 0.5,
                  display: {
                    xs: "none",
                    md: "inline",
                  },
                }}
              >
                - HCP Module
              </Box>
            )}
          </Typography>

          {/* Status Chip - Hidden on mobile */}
          {!isMobile && (
            <Chip
              label="Live"
              size="small"
              aria-label="System Status Live"
              sx={{
                bgcolor: mode === 'light' ? '#DCFCE7' : '#065F46',
                color: mode === 'light' ? '#166534' : '#6EE7B7',
                fontWeight: 700,
                fontSize: "0.65rem",
                borderRadius: 2,
                height: 20,
                "& .MuiChip-label": {
                  px: 1,
                },
                display: {
                  xs: "none",
                  md: "inline-flex",
                },
                "&:focus-visible": {
                  outline: "3px solid #1976D2",
                  outlineOffset: 2,
                  borderRadius: 6
                }
              }}
            />
          )}
        </Box>

        {/* Right Section - Theme Toggle and User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              sm: 2,
              md: 2,
            },
          }}
        >
          {/* Theme Toggle */}
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton
              color="primary"
              size="large"
              aria-label={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              onClick={toggleTheme}
              sx={{
                borderRadius: 2,
                p: 1,
                transition: 'all 0.2s ease',
                ...buttonSx,
                ...iconButtonSx,
                px: 1.5,
                py: 1.5,
                "&:hover": {
                  transform: "scale(1.08) rotate(15deg)",
                  boxShadow: "none",
                },
              }}
            >
              {mode === 'light' ? (
                <Brightness4Icon sx={{ color: "#475569", fontSize: 24 }} />
              ) : (
                <Brightness7Icon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* User Info */}
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              gap: 1,
            }}
          >
            {!isTablet && (
              <Typography
                variant="body2"
                sx={{
                  color: "#475569", // Improved contrast
                  fontWeight: 500,
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                Field Representative
              </Typography>
            )}

            {isTablet && !isMobile && (
              <Typography
                variant="caption"
                sx={{
                  color: "#475569", // Improved contrast
                  fontWeight: 500,
                  display: {
                    xs: "none",
                    lg: "none",
                    md: "block",
                  },
                }}
              >
                FR
              </Typography>
            )}
          </Box>

          {/* Avatar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="User Menu">
              <Avatar
                onClick={handleMenuClick}
                aria-label="User Profile"
                title="User Profile"
                tabIndex={0}
                sx={avatarSx}
              >
                FR
              </Avatar>
            </Tooltip>
          </Box>

          {/* Mobile User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                ...buttonSx,
                "&:focus-visible": {
                  outline: "3px solid #1976D2",
                  outlineOffset: 2,
                  borderRadius: 6
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography fontWeight={600} color={theme.palette.text.primary}>
                  Field Representative
                </Typography>
                <Typography variant="caption" color="#475569">
                  FR • HCP Module
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                ...buttonSx,
                "&:focus-visible": {
                  outline: "3px solid #1976D2",
                  outlineOffset: 2,
                  borderRadius: 6
                }
              }}
            >
              <Typography color={theme.palette.text.primary}>Profile</Typography>
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                ...buttonSx,
                "&:focus-visible": {
                  outline: "3px solid #1976D2",
                  outlineOffset: 2,
                  borderRadius: 6
                }
              }}
            >
              <Typography color={theme.palette.text.primary}>Settings</Typography>
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                ...buttonSx,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.15)",
                },
                "&:focus-visible": {
                  outline: "3px solid #1976D2",
                  outlineOffset: 2,
                  borderRadius: 6
                }
              }}
            >
              <Typography color={theme.palette.error.main}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;