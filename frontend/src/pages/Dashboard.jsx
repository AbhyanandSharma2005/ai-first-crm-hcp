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
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing, commonTypography } from "../theme/theme";

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

  const fetchMetrics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    try {
      const response = await API.get("/metrics");

      if (response.data?.success && response.data?.data) {
        setMetrics(response.data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch metrics", error);
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
    },
    {
      title: "Interactions",
      value:
        dashboardStats?.total_interactions ??
        metrics?.total_interactions ??
        "—",
      description: "Meetings and follow-ups",
      trend: "CRM activity",
    },
    {
      title: "Application",
      value: metrics?.status ?? "—",
      description: metrics?.api ?? "AI CRM platform",
      trend: "System health",
    },
    {
      title: "Environment",
      value: metrics?.environment ?? "—",
      description: `Version ${metrics?.version ?? "—"}`,
      trend: "Deployment",
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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        p: commonSpacing.pagePadding,
        pb: 5,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
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
          mb: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              ...commonTypography.pageTitle,
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2.125rem",
              },
            }}
          >
            Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 0,
              mt: 0.5,
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
          spacing={1.25}
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
            sx={{
              borderColor: theme.palette.divider,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              fontWeight: 700,
              borderRadius: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => fetchMetrics(true)}
            disabled={refreshing}
            fullWidth={isMobile}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
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

      {/* Hero Card */}
      <Card
        sx={{
          mb: {
            xs: 3,
            md: 4,
          },
          overflow: "hidden",
          borderRadius: 4,
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at 88% 15%, rgba(122, 164, 255, .48), transparent 28%), linear-gradient(125deg, #14213D 0%, #1D4ED8 100%)",
          boxShadow: `0 18px 34px ${theme.palette.primary.main}40`,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },
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
              gap: 3,
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
                sx={{
                  mb: 2,
                  color: "#DCE8FF",
                  bgcolor: "rgba(255,255,255,.13)",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: {
                    xs: "1.125rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                  },
                }}
              >
                Make every HCP interaction more valuable.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,.82)",
                  lineHeight: 1.7,
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
              startIcon={<AddOutlinedIcon />}
              fullWidth
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.25,
                textTransform: "none",
                fontWeight: 700,
                flexShrink: 0,
                bgcolor: "#FFFFFF",
                color: theme.palette.primary.main,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                "&:hover": {
                  bgcolor: "#EAF1FF",
                },
              }}
            >
              Log interaction
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <Grid 
        container 
        spacing={commonSpacing.gridSpacing}
        sx={{ 
          mb: {
            xs: 3,
            md: 4,
          }
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
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  background: style.background,
                  boxShadow: 1,
                  transition: "transform .2s ease, box-shadow .2s ease",
                  "&:hover": {
                    transform: {
                      xs: "none",
                      md: "translateY(-4px)",
                    },
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2,
                      sm: 2.5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${style.accent}18`,
                        color: style.accent,
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                      }}
                    >
                      {style.icon}
                    </Avatar>

                    <Typography
                      variant="caption"
                      sx={{
                        color: style.accent,
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.75rem",
                        },
                      }}
                    >
                      {card.trend}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.875rem",
                      },
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.75,
                      mb: 0.5,
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

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                      },
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

      {/* Dashboard Analytics */}
      <Box
        sx={{
          width: "100%",
          mt: commonSpacing.sectionSpacing,
          mb: commonSpacing.sectionSpacing,
        }}
      >
        <DashboardAnalytics
          onDataLoaded={(data) => {
            console.log("✅ Dashboard Analytics data loaded:", data);
            setDashboardStats(data);
            setLastUpdated(new Date());
          }}
        />
      </Box>

      {/* Search HCP */}
      <Box
        sx={{
          width: "100%",
          mt: commonSpacing.sectionSpacing,
        }}
      >
        <SearchHCP />
      </Box>

      {/* Metrics */}
      <Box
        sx={{
          width: "100%",
          mt: commonSpacing.sectionSpacing,
        }}
      >
        <Metrics />
      </Box>
    </Box>
  );
}

export default Dashboard;