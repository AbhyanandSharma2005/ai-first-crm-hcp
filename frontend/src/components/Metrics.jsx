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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import API from "../api/api";

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
        boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
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
                width: 46,
                height: 46,
                borderRadius: 2.5,
                bgcolor: "#E9FBF6",
                color: "#10A683",
              }}
            >
              <MonitorHeartOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={750} color="#172033">
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
                  fontWeight: 600,
                }}
              />
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => fetchMetrics(true)}
              disabled={refreshing}
              startIcon={
                refreshing ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <RefreshRoundedIcon />
                )
              }
              sx={{
                borderColor: "#D9E1F2",
                color: "#475569",
                bgcolor: "#FFFFFF",
              }}
            >
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2.5 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchMetrics(true)}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <MetricsSkeleton />
        ) : metrics ? (
          <Grid container spacing={2}>
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
                  borderRadius: 3,
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(135deg, #172554 0%, #2855D9 100%)",
                  boxShadow: "0 10px 20px rgba(40,85,217,.2)",
                }}
              >
                <CardContent>
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
          <Box
            sx={{
              py: 5,
              textAlign: "center",
              border: "1px dashed #D9E1F2",
              borderRadius: 3,
              bgcolor: "#FAFBFD",
            }}
          >
            <Typography fontWeight={700} color="#475569">
              Metrics are unavailable
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Try refreshing once the backend service is available.
            </Typography>
          </Box>
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
        borderRadius: 3,
        border: "1px solid #E7ECF5",
        background,
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 24px rgba(15,23,42,.09)",
        },
      }}
    >
      <CardContent>
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
              borderRadius: 2.25,
              color,
              bgcolor: "#FFFFFFA8",
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
                fontWeight: 750,
              }}
            />
          )}
        </Box>

        <Typography variant="body2" color="#64748B">
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

function MetricsSkeleton() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} lg={4} key={item}>
          <Card
            sx={{
              minHeight: 180,
              borderRadius: 3,
              border: "1px solid #E7ECF5",
            }}
          >
            <CardContent>
              <Skeleton variant="rounded" width={40} height={40} />
              <Skeleton width="55%" sx={{ mt: 3 }} />
              <Skeleton width="38%" height={40} />
              <Skeleton width="75%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Metrics;