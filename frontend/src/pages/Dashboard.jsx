import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Link } from "react-router-dom";

import API from "../api/api";
import DashboardAnalytics from "../components/DashboardAnalytics";
import LoadingCards from "../components/LoadingCards";
import SearchHCP from "../components/SearchHCP";
import Metrics from "../components/Metrics";
import AppSnackbar from "../components/AppSnackbar";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing, commonTypography } from "../theme/theme";

// Reusable button style object
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

// Outlined button style
const outlinedButtonSx = {
  ...buttonSx,
  borderWidth: 2,
  "&:hover": {
    borderWidth: 2,
    transform: "translateY(-2px)"
  }
};

// Icon button style
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

// Reusable card animation with reduced motion support
const cardAnimation = {
  transition: "all 0.3s ease-in-out",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    transform: "none"
  },
  "&:hover": {
    transform: "translateY(-6px) scale(1.01)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.18)"
  }
};

// KPI card animation with consistent shadow
const kpiCardAnimation = {
  transition: "all .3s ease",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    transform: "none"
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 8,
  }
};

// Focus visibility for cards
const cardFocusSx = {
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Consistent card shadow
const cardShadowSx = {
  boxShadow: 2,
  "&:hover": {
    boxShadow: 8,
    transform: "translateY(-4px)"
  }
};

function Dashboard() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [metrics, setMetrics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const fetchMetrics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    try {
      const response = await API.get("/metrics");

      if (response.data?.success && response.data?.data) {
        setMetrics(response.data.data);
        setLastUpdated(new Date());
        if (isManualRefresh) {
          showSnackbar("success", "Dashboard refreshed successfully.");
        }
      } else {
        if (isManualRefresh) {
          showSnackbar("error", "Failed to refresh dashboard.");
        }
      }
    } catch (err) {
      console.error(err);
      showSnackbar("error", "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    const interval = window.setInterval(() => fetchMetrics(), 30000);
    return () => window.clearInterval(interval);
  }, [fetchMetrics]);

  // WebSocket connection simulation for snackbar notifications
  useEffect(() => {
    // Simulate WebSocket connection
    const isConnected = true; // This would come from your WebSocket context/state
    
    // Simulate connection status changes
    if (isConnected) {
      showSnackbar("success", "Live connection restored.");
    } else {
      showSnackbar("warning", "Realtime updates disconnected.");
    }

    // Cleanup if needed
    return () => {
      // WebSocket cleanup would go here
    };
  }, []); // Add WebSocket connection status as dependency

  if (loading) {
    return (
      <Box
        sx={{
          p: commonSpacing.pagePadding,
        }}
      >
        <LoadingCards />
      </Box>
    );
  }

  const cards = [
    {
      title: "Total HCPs",
      value: dashboardStats?.total_hcps ?? metrics?.total_hcps ?? "—",
      description: "Healthcare professionals",
      trend: "Active records",
      ariaLabel: "Total Healthcare Professionals",
    },
    {
      title: "Interactions",
      value:
        dashboardStats?.total_interactions ??
        metrics?.total_interactions ??
        "—",
      description: "Meetings and follow-ups",
      trend: "CRM activity",
      ariaLabel: "Total Interactions",
    },
    {
      title: "Application",
      value: metrics?.status ?? "—",
      description: metrics?.api ?? "AI CRM platform",
      trend: "System health",
      ariaLabel: "Application Status",
    },
    {
      title: "Environment",
      value: metrics?.environment ?? "—",
      description: `Version ${metrics?.version ?? "—"}`,
      trend: "Deployment",
      ariaLabel: "Environment Details",
    },
  ];

  const getCardStyles = () => {
    const isDark = mode === 'dark';
    return [
      {
        icon: <PeopleAltOutlinedIcon />,
        accent: "#2F6BFF",
        background: isDark 
          ? "linear-gradient(135deg, #1A2A4A 0%, #1E2D5A 100%)" 
          : "linear-gradient(135deg, #EEF4FF 0%, #F9FBFF 100%)",
      },
      {
        icon: <EventNoteOutlinedIcon />,
        accent: "#11A683",
        background: isDark 
          ? "linear-gradient(135deg, #0D2E26 0%, #1A3D33 100%)" 
          : "linear-gradient(135deg, #E9FBF6 0%, #FBFFFE 100%)",
      },
      {
        icon: <SmartToyOutlinedIcon />,
        accent: "#8B5CF6",
        background: isDark 
          ? "linear-gradient(135deg, #2A1A4A 0%, #3A1D5A 100%)" 
          : "linear-gradient(135deg, #F4F0FF 0%, #FCFBFF 100%)",
      },
      {
        icon: <TrendingUpOutlinedIcon />,
        accent: "#F59E0B",
        background: isDark 
          ? "linear-gradient(135deg, #3D2A0D 0%, #4A331A 100%)" 
          : "linear-gradient(135deg, #FFF7E8 0%, #FFFCF5 100%)",
      },
    ];
  };

  const cardStyles = getCardStyles();

  // Uniform section spacing - 32px between sections
  const sectionSpacing = 4; // 32px

  return (
    <Box
      component="main"
      role="main"
      aria-label="Dashboard Main Content"
      sx={{
        width: "100%",
        maxWidth: "1440px",
        mx: "auto",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
          lg: 5,
        },
        pb: 5,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Page Header - 32px spacing to next section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          justifyContent: "space-between",
          gap: 2,
          mb: sectionSpacing,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              ...commonTypography.pageTitle,
              fontSize: {
                xs: "1.75rem",
                sm: "2rem",
                md: "2.125rem",
              },
              mb: 0.5,
            }}
          >
            Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 0,
              mt: 0.5,
              color: "#475569",
              fontSize: "1rem",
            }}
          >
            Monitor field activity, healthcare professionals, and CRM insights.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Chip
            label={`Updated ${lastUpdated.toLocaleTimeString()}`}
            variant="outlined"
            size="small"
            aria-label={`Dashboard updated at ${lastUpdated.toLocaleTimeString()}`}
            sx={{
              borderColor: theme.palette.divider,
              bgcolor: theme.palette.background.paper,
              color: "#475569",
              fontWeight: 700,
              borderRadius: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
              "&:focus-visible": {
                outline: "3px solid #1976D2",
                outlineOffset: 2,
                borderRadius: 6
              }
            }}
          />

          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => fetchMetrics(true)}
            disabled={refreshing}
            aria-label="Refresh Dashboard"
            fullWidth={isMobile}
            sx={{
              ...outlinedButtonSx,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              bgcolor: theme.palette.background.paper,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </Stack>
      </Box>

      {/* Hero Card - 32px spacing */}
      <Card
        sx={{
          mb: sectionSpacing,
          overflow: "hidden",
          borderRadius: 5,
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at 88% 15%, rgba(122, 164, 255, .48), transparent 28%), linear-gradient(125deg, #14213D 0%, #1D4ED8 100%)",
          boxShadow: `0 18px 34px ${theme.palette.primary.main}40`,
          transition: "all .3s ease",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none"
          },
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 24px 48px ${theme.palette.primary.main}50`
          },
          ...cardFocusSx,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3.5,
              sm: 4.5,
              md: 5.5,
            },
            transition: "all .3s",
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none"
            },
            ".MuiTypography-root": {
              transition: "all .25s",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none"
              }
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 3.5,
            }}
          >
            <Box
              sx={{
                maxWidth: {
                  xs: "100%",
                  md: 650,
                },
              }}
            >
              <Chip
                label="AI-enabled workflow"
                size="small"
                aria-label="AI-enabled workflow"
                sx={{
                  mb: 2.5,
                  color: "#DCE8FF",
                  bgcolor: "rgba(255,255,255,.13)",
                  fontWeight: 700,
                  borderRadius: 2,
                  "&:focus-visible": {
                    outline: "3px solid #1976D2",
                    outlineOffset: 2,
                    borderRadius: 6
                  }
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 1.5,
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                  },
                }}
              >
                Make every HCP interaction more valuable.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,.82)",
                  lineHeight: 1.8,
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                  },
                }}
              >
                Log meetings, extract AI-assisted insights, and keep your
                follow-up actions visible to the whole field team.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/log-interaction"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddOutlinedIcon />}
              aria-label="Log Interaction"
              fullWidth
              sx={{
                ...buttonSx,
                flexShrink: 0,
                bgcolor: "#FFFFFF",
                color: theme.palette.primary.main,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                py: 1.5,
                px: 4,
                transition: "all .25s",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none"
                },
                "&:hover": {
                  bgcolor: "#EAF1FF",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,.15)",
                },
              }}
            >
              Log interaction
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Cards - 32px spacing - Full width cards */}
      <Grid 
        container 
        spacing={commonSpacing.gridSpacing}
        sx={{ 
          mb: sectionSpacing,
          width: "100%",
        }}
      >
        {cards.map((card, index) => {
          const style = cardStyles[index];

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={3}
              key={card.title}
              sx={{
                display: "flex",
              }}
            >
              <Card
                tabIndex={0}
                role="article"
                aria-label={card.ariaLabel}
                sx={{
                  width: "100%",
                  borderRadius: 5,
                  border: `1px solid ${theme.palette.divider}`,
                  background: style.background,
                  display: "flex",
                  flexDirection: "column",
                  ...cardShadowSx,
                  ...kpiCardAnimation,
                  ...cardFocusSx,
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    p: {
                      xs: 3,
                      sm: 3,
                    },
                    display: "flex",
                    flexDirection: "column",
                    transition: "all .3s",
                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none"
                    },
                    ".MuiTypography-root": {
                      transition: "all .25s",
                      "@media (prefers-reduced-motion: reduce)": {
                        transition: "none"
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${style.accent}18`,
                        color: style.accent,
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        transition: "all .3s",
                        "@media (prefers-reduced-motion: reduce)": {
                          transition: "none"
                        },
                        "&:hover": {
                          transform: "scale(1.1) rotate(-5deg)",
                        },
                        "&:focus-visible": {
                          outline: "3px solid #1976D2",
                          outlineOffset: 2,
                          borderRadius: 6
                        }
                      }}
                    >
                      {style.icon}
                    </Avatar>

                    <Typography
                      variant="caption"
                      sx={{
                        color: style.accent,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {card.trend}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "#475569",
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        mt: 0.75,
                        mb: 1,
                        color: theme.palette.text.primary,
                        fontWeight: 800,
                        textTransform:
                          card.title === "Application" ||
                          card.title === "Environment"
                            ? "capitalize"
                            : "none",
                        fontSize: {
                          xs: "1.5rem",
                          sm: "1.75rem",
                          md: "2rem",
                          lg: "2.125rem",
                        },
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#475569",
                      mt: "auto",
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dashboard Analytics - 32px spacing */}
      <Box
        sx={{
          width: "100%",
          mb: sectionSpacing,
        }}
      >
        <DashboardAnalytics
          onDataLoaded={(data) => {
            console.log("✅ Dashboard Analytics data loaded:", data);
            setDashboardStats(data);
            setLastUpdated(new Date());
            showSnackbar("success", "Analytics data loaded successfully.");
          }}
          onError={(error) => {
            console.error("❌ Failed to load analytics:", error);
            showSnackbar("error", "Failed to load analytics data.");
          }}
        />
      </Box>

      {/* Search HCP - 32px spacing */}
      <Box
        sx={{
          width: "100%",
          mb: sectionSpacing,
        }}
      >
        <SearchHCP />
      </Box>

      {/* Metrics - 32px spacing */}
      <Box
        sx={{
          width: "100%",
          mb: sectionSpacing,
        }}
      >
        <Metrics />
      </Box>

      {/* App Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default Dashboard;