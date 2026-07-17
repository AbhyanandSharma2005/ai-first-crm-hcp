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

const cardStyles = [
  {
    icon: <PeopleAltOutlinedIcon />,
    accent: "#2F6BFF",
    background: "linear-gradient(135deg, #EEF4FF 0%, #F9FBFF 100%)",
  },
  {
    icon: <EventNoteOutlinedIcon />,
    accent: "#11A683",
    background: "linear-gradient(135deg, #E9FBF6 0%, #FBFFFE 100%)",
  },
  {
    icon: <SmartToyOutlinedIcon />,
    accent: "#8B5CF6",
    background: "linear-gradient(135deg, #F4F0FF 0%, #FCFBFF 100%)",
  },
  {
    icon: <TrendingUpOutlinedIcon />,
    accent: "#F59E0B",
    background: "linear-gradient(135deg, #FFF7E8 0%, #FFFCF5 100%)",
  },
];

function Dashboard() {
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
      <Box sx={{ py: 3 }}>
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

  return (
    <Box sx={{ pb: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "#2F6BFF",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            HCP COMMAND CENTER
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#172033",
              fontWeight: 800,
              mt: 0.25,
              letterSpacing: "-0.03em",
            }}
          >
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Monitor field activity, healthcare professionals, and CRM insights.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Chip
            label={`Updated ${lastUpdated.toLocaleTimeString()}`}
            variant="outlined"
            sx={{
              borderColor: "#D9E1F2",
              bgcolor: "#FFFFFF",
              color: "#5D6B82",
              fontWeight: 600,
            }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => fetchMetrics(true)}
            disabled={refreshing}
            sx={{
              borderColor: "#D9E1F2",
              color: "#334155",
              bgcolor: "#FFFFFF",
            }}
          >
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </Stack>
      </Box>

      <Card
        sx={{
          mb: 4,
          overflow: "hidden",
          borderRadius: 4,
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at 88% 15%, rgba(122, 164, 255, .48), transparent 28%), linear-gradient(125deg, #14213D 0%, #1D4ED8 100%)",
          boxShadow: "0 18px 34px rgba(30, 64, 175, 0.22)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: 650 }}>
              <Chip
                label="AI-enabled workflow"
                size="small"
                sx={{
                  mb: 2,
                  color: "#DCE8FF",
                  bgcolor: "rgba(255,255,255,.13)",
                  fontWeight: 700,
                }}
              />

              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Make every HCP interaction more valuable.
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,.82)", lineHeight: 1.7 }}>
                Log meetings, extract AI-assisted insights, and keep your
                follow-up actions visible to the whole field team.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/log-interaction"
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              sx={{
                flexShrink: 0,
                bgcolor: "#FFFFFF",
                color: "#1D4ED8",
                px: 2.5,
                py: 1.25,
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

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {cards.map((card, index) => {
          const style = cardStyles[index];

          return (
            <Grid item xs={12} sm={6} lg={3} key={card.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3.5,
                  border: "1px solid #E7ECF5",
                  background: style.background,
                  transition: "transform .2s ease, box-shadow .2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 14px 28px rgba(15, 23, 42, .10)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
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
                        width: 46,
                        height: 46,
                      }}
                    >
                      {style.icon}
                    </Avatar>

                    <Typography
                      variant="caption"
                      sx={{ color: style.accent, fontWeight: 700 }}
                    >
                      {card.trend}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.75,
                      mb: 0.5,
                      color: "#172033",
                      fontWeight: 800,
                      textTransform:
                        card.title === "Application" ||
                        card.title === "Environment"
                          ? "capitalize"
                          : "none",
                    }}
                  >
                    {card.value}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <DashboardAnalytics
        onDataLoaded={(data) => {
          setDashboardStats(data);
          setLastUpdated(new Date());
        }}
      />

      <Box sx={{ mt: 5 }}>
        <SearchHCP />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Metrics />
      </Box>
    </Box>
  );
}

export default Dashboard;