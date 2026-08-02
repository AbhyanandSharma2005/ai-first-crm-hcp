import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

import API from "../api/api";
import { commonSpacing } from "../theme/theme";
import LoadingCards from "./LoadingCards";
import EmptyState from "./EmptyState";

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

function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMetrics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await API.get("/metrics");

      if (response.data?.success && response.data?.data) {
        setMetrics(response.data.data);
        setError("");
        setLastUpdated(new Date());
      } else {
        setMetrics(null);
        setError(response.data?.message || "Unable to load system metrics.");
      }
    } catch (err) {
      console.error("Metrics request failed:", err);
      setError(
        err.response?.data?.message ||
          "Unable to connect to the metrics service."
      );
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

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #E7ECF5",
        boxShadow: "0 8px 25px rgba(15,23,42,.08)",
        ...cardAnimation,
      }}
    >
      <CardContent 
        sx={{ 
          p: { xs: 2.5, md: 3.5 },
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
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                borderRadius: 3,
                bgcolor: "#E9FBF6",
                color: "#10A683",
                transition: "all .3s",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none"
                },
                "&:hover": {
                  transform: "scale(1.1) rotate(-5deg)",
                }
              }}
            >
              <MonitorHeartOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={700} color="#172033">
                Application metrics
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Live CRM platform health and activity overview.
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {lastUpdated && (
              <Chip
                size="small"
                label={`Updated ${lastUpdated.toLocaleTimeString()}`}
                sx={{
                  color: "#64748B",
                  bgcolor: "#F5F7FB",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            )}

            <Tooltip title="Refresh Metrics">
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => fetchMetrics(true)}
                disabled={refreshing}
                startIcon={
                  refreshing ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : (
                    <RefreshRoundedIcon />
                  )
                }
                aria-label="Refresh Metrics"
                sx={{
                  ...outlinedButtonSx,
                  borderColor: "#D9E1F2",
                  color: "#475569",
                  bgcolor: "#FFFFFF",
                  transition: "all .25s",
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none"
                  },
                  "&:hover": {
                    borderColor: "#2855D9",
                    color: "#2855D9",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    bgcolor: "action.hover",
                  },
                }}
              >
                {refreshing ? "Refreshing" : "Refresh"}
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2.5 }}
            action={
              <Button
                color="primary"
                size="medium"
                onClick={() => fetchMetrics(true)}
                aria-label="Retry loading metrics"
                sx={{
                  ...buttonSx,
                  py: 0.8,
                  px: 2,
                  borderRadius: 2,
                  transition: "all .25s",
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none"
                  },
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,.15)"
                  }
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingCards count={4} />
        ) : metrics ? (
          <Grid container spacing={commonSpacing.gridSpacing}>
            <Grid item xs={12} sm={6} lg={4}>
              <MetricCard
                label="Total interactions"
                value={metrics.total_interactions ?? "—"}
                description="Recorded CRM engagements"
                icon={<EventNoteOutlinedIcon />}
                color="#2855D9"
                background="#EEF4FF"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <MetricCard
                label="Healthcare professionals"
                value={metrics.total_hcps ?? "—"}
                description="HCP records in the directory"
                icon={<PeopleAltOutlinedIcon />}
                color="#10A683"
                background="#E9FBF6"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <MetricCard
                label="Application status"
                value={metrics.status || "Unknown"}
                description="Current platform availability"
                icon={<VerifiedOutlinedIcon />}
                color="#8B5CF6"
                background="#F4F0FF"
                isStatus
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <MetricCard
                label="Environment"
                value={metrics.environment || "—"}
                description={`Version ${metrics.version || "—"}`}
                icon={<CloudOutlinedIcon />}
                color="#F59E0B"
                background="#FFF7E8"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <MetricCard
                label="API service"
                value={metrics.api || "Available"}
                description="Backend service connection"
                icon={<ApiOutlinedIcon />}
                color="#EC5B5B"
                background="#FFF0F0"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(135deg, #172554 0%, #2855D9 100%)",
                  boxShadow: "0 10px 20px rgba(40,85,217,.2)",
                  ...cardAnimation,
                }}
              >
                <CardContent
                  sx={{
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,.72)",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    AUTO REFRESH
                  </Typography>

                  <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
                    Every 30 seconds
                  </Typography>

                  <Divider
                    sx={{
                      my: 1.5,
                      borderColor: "rgba(255,255,255,.18)",
                    }}
                  />

                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,.8)" }}>
                    Metrics are automatically refreshed to keep operational data current.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <EmptyState
            icon={<InsightsOutlinedIcon />}
            title="Metrics Unavailable"
            description="Dashboard metrics will automatically appear after data is collected."
          />
        )}
      </CardContent>
    </Card>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon,
  color,
  background,
  isStatus = false,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E7ECF5",
        background,
        boxShadow: "0 8px 25px rgba(15,23,42,.08)",
        ...cardAnimation,
      }}
    >
      <CardContent
        sx={{
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
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 3,
              color,
              bgcolor: "#FFFFFFA8",
              transition: "all .3s",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none"
              },
              "&:hover": {
                transform: "scale(1.1) rotate(-5deg)",
              }
            }}
          >
            {icon}
          </Box>

          {isStatus && (
            <Chip
              label="Live"
              size="small"
              sx={{
                color: "#078564",
                bgcolor: "#D9F9EE",
                fontWeight: 700,
                borderRadius: 2,
              }}
            />
          )}
        </Box>

        <Typography variant="subtitle2" color="#64748B">
          {label}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={800}
          color="#172033"
          sx={{
            mt: 0.75,
            mb: 0.5,
            textTransform: isStatus ? "capitalize" : "none",
          }}
        >
          {value}
        </Typography>

        <Typography variant="caption" color="#64748B">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Metrics;