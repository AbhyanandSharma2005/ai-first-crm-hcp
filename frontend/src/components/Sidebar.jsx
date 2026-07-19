import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 264;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardRoundedIcon />,
    path: "/",
  },
  {
    text: "Log Interaction",
    icon: <AddCircleOutlineRoundedIcon />,
    path: "/log-interaction",
  },
  {
    text: "Interaction History",
    icon: <HistoryRoundedIcon />,
    path: "/history",
  },
];

function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: {
          xs: "none",
          md: "block",
        },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          px: 1.5,
          top: "72px",
          height: "calc(100vh - 72px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.text.disabled,
          },
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ px: 1.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 8px 18px ${theme.palette.primary.main}40`,
            }}
          >
            <AutoAwesomeRoundedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontWeight={800}
              color={theme.palette.text.primary}
              sx={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
            >
              AI First CRM
            </Typography>

            <Typography variant="caption" color={theme.palette.text.secondary}>
              HCP Intelligence
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* Menu Section */}
      <Box sx={{ px: 1.5, pt: 3 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            color: theme.palette.text.secondary,
            fontWeight: 800,
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
          }}
        >
          WORKSPACE
        </Typography>

        <List disablePadding sx={{ mt: 1.25 }}>
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    minHeight: 46,
                    px: 1.5,
                    borderRadius: 2.5,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    transition: "all .2s ease",
                    "& .MuiListItemIcon-root": {
                      minWidth: 38,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.disabled,
                    },
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main + "20",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main + "30",
                      },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ mt: "auto", p: 1.5, pb: 2.5 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: theme.palette.primary.main + "10",
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Chip
            label="AI-enabled"
            size="small"
            sx={{
              mb: 1,
              bgcolor: theme.palette.primary.main + "20",
              color: theme.palette.primary.main,
              fontWeight: 700,
              borderRadius: 2,
              fontSize: 11,
            }}
          />

          <Typography variant="body2" fontWeight={700} color={theme.palette.text.primary}>
            HCP intelligence hub
          </Typography>

          <Typography
            variant="caption"
            color={theme.palette.text.secondary}
            sx={{ display: "block", mt: 0.5, lineHeight: 1.5 }}
          >
            Capture interactions and turn field data into action.
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;