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

  return (
    <AppBar
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
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuToggle}
              sx={{
                mr: 1,
                color: theme.palette.text.secondary,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant={isMobile ? "body1" : "h6"}
            fontWeight="700"
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
                  color: theme.palette.text.secondary,
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
              onClick={toggleTheme}
              color="inherit"
              sx={{
                borderRadius: 2,
                p: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transform: 'rotate(15deg)',
                },
              }}
            >
              {mode === 'light' ? (
                <Brightness4Icon sx={{ color: theme.palette.text.secondary, fontSize: 24 }} />
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
                  color: theme.palette.text.secondary,
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
                  color: theme.palette.text.secondary,
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
            <Avatar
              onClick={handleMenuClick}
              sx={{
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
              }}
            >
              FR
            </Avatar>
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
            <MenuItem onClick={handleMenuClose}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography fontWeight={600} color={theme.palette.text.primary}>
                  Field Representative
                </Typography>
                <Typography variant="caption" color={theme.palette.text.secondary}>
                  FR • HCP Module
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Typography color={theme.palette.text.primary}>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Typography color={theme.palette.text.primary}>Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Typography color={theme.palette.error.main}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;