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
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          borderRight: "1px solid #E8EDF5",
          background: "#FFFFFF",
          px: 1.5,
        },
      }}
    >
      <Box sx={{ px: 1.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: "#2855D9",
              boxShadow: "0 8px 18px rgba(40,85,217,.25)",
            }}
          >
            <AutoAwesomeRoundedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontWeight={800}
              color="#172033"
              sx={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
            >
              AI First CRM
            </Typography>

            <Typography variant="caption" color="text.secondary">
              HCP Intelligence
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#EDF0F5" }} />

      <Box sx={{ px: 1.5, pt: 3 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            color: "#98A2B3",
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
                    color: isActive ? "#2855D9" : "#526176",
                    transition: "all .2s ease",
                    "& .MuiListItemIcon-root": {
                      minWidth: 38,
                      color: isActive ? "#2855D9" : "#7A879A",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#EAF0FF",
                      "&:hover": {
                        bgcolor: "#E0E9FF",
                      },
                    },
                    "&:hover": {
                      bgcolor: "#F5F7FB",
                      color: "#2855D9",
                      "& .MuiListItemIcon-root": {
                        color: "#2855D9",
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

      <Box sx={{ mt: "auto", p: 1.5, pb: 2.5 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#F5F7FF",
            border: "1px solid #E2E9FF",
          }}
        >
          <Chip
            label="AI-enabled"
            size="small"
            sx={{
              mb: 1,
              bgcolor: "#E1EAFE",
              color: "#2855D9",
              fontWeight: 700,
              fontSize: 11,
            }}
          />

          <Typography variant="body2" fontWeight={700} color="#27364D">
            HCP intelligence hub
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
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