import { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    Skeleton,
    Chip,
    Divider
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import API from "../api/api";

import DashboardFilters from "./DashboardFilters";
import ProductPieChart from "./ProductPieChart";
import InteractionTrend from "./InteractionTrend";
import RecentInteractionsTable from "./RecentInteractionsTable";

function DashboardAnalytics({ onDataLoaded }) {

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [stats, setStats] = useState(null);

    const [monthlyData, setMonthlyData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState("");

    const [responseTime, setResponseTime] = useState("");

    const [filters, setFilters] = useState({

        product: "",

        doctor: "",

        month: ""

    });

    //-----------------------------------------------------
    // Fetch Dashboard Statistics
    //-----------------------------------------------------

    const fetchDashboardStats = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(

                "/dashboard/stats",

                {

                    params: Object.fromEntries(
                        Object.entries(filters).filter(
                            ([, value]) => value !== "" && value !== null && value !== undefined
                        )
                    )

                }

            );

            setResponseTime(

                response.headers["x-process-time"] || "-"

            );

            if (

                response.data.success &&

                response.data.data

            ) {

                setStats(

                    response.data.data

                );

                setLastUpdated(

                    new Date().toLocaleTimeString()

                );

                if (onDataLoaded) {

                    onDataLoaded(

                        response.data.data

                    );

                }

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load dashboard."

                );

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Unable to load dashboard."

            );

        }

        finally {

            setLoading(false);

        }

    };

    //-----------------------------------------------------
    // Fetch Monthly Trend
    //-----------------------------------------------------

    const fetchMonthlyTrend = async () => {

        try {

            const response = await API.get(

                "/dashboard/monthly"

            );

            if (

                response.data.success

            ) {

                setMonthlyData(

                    response.data.data.monthly_data

                );

            }

        }

        catch (err) {

            console.error(

                "Monthly trend error",

                err

            );

        }

    };

    //-----------------------------------------------------
    // Initial Load
    //-----------------------------------------------------

    useEffect(() => {

        fetchDashboardStats();

    }, [filters]);

    //-----------------------------------------------------
    // Auto Refresh Dashboard
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchDashboardStats();

        }, 30000);

        return () => clearInterval(interval);

    }, [filters]);

    //-----------------------------------------------------
    // Auto Refresh Trend
    //-----------------------------------------------------

    useEffect(() => {

        fetchMonthlyTrend();

        const interval = setInterval(() => {

            fetchMonthlyTrend();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    //-----------------------------------------------------
    // Loading
    //-----------------------------------------------------

    if (loading) {

        return (

            <Box sx={{ mt: 4 }}>

                <Skeleton
                    variant="rounded"
                    height={90}
                    sx={{ mb: 4 }}
                />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Skeleton
                            variant="rounded"
                            height={180}
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Skeleton
                            variant="rounded"
                            height={180}
                        />

                    </Grid>

                </Grid>

                <Skeleton
                    variant="rounded"
                    height={320}
                    sx={{ mt: 3 }}
                />

            </Box>

        );

    }

    //-----------------------------------------------------
    // Error
    //-----------------------------------------------------

    if (error) {

        return (

            <Alert

                severity="error"

                sx={{

                    mt: 3,

                    borderRadius: 2

                }}

            >

                {error}

            </Alert>

        );

    }

    //-----------------------------------------------------
    // Empty
    //-----------------------------------------------------

    if (!stats) {

        return (

            <Alert

                severity="info"

                sx={{

                    mt: 3,

                    borderRadius: 2

                }}

            >

                Dashboard data unavailable.

            </Alert>

        );

    }

    //-----------------------------------------------------
    // Main UI
    //-----------------------------------------------------

    return (

        <Box

            sx={{

                mt: 4,

                pb: 5

            }}

        >
            {/* =========================================================
            Header
        ========================================================== */}

            <Card
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg,#0F172A 0%, #1E3A8A 100%)",
                    color: "#ffffff",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.25)"
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2
                        }}
                    >

                        <Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 1
                                }}
                            >

                                <AnalyticsIcon
                                    sx={{
                                        fontSize: 34
                                    }}
                                />

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    Dashboard Analytics
                                </Typography>

                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    opacity: 0.9
                                }}
                            >
                                AI-powered CRM insights and performance monitoring
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                flexWrap: "wrap"
                            }}
                        >

                            <Chip
                                icon={<AccessTimeIcon />}
                                label={`Updated : ${lastUpdated || "--"}`}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    color: "#fff",
                                    fontWeight: 600
                                }}
                            />

                            <Chip
                                icon={<SpeedIcon />}
                                label={`Response : ${responseTime || "--"} sec`}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    color: "#fff",
                                    fontWeight: 600
                                }}
                            />

                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={fetchDashboardStats}
                                sx={{
                                    bgcolor: "#ffffff",
                                    color: "#1565C0",
                                    fontWeight: 700,
                                    "&:hover": {
                                        bgcolor: "#E3F2FD"
                                    }
                                }}
                            >
                                Refresh
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

            {/* =========================================================
            Dashboard Filters
        ========================================================== */}

            <DashboardFilters
                onApply={setFilters}
            />

            {/* =========================================================
            Empty State
        ========================================================== */}

            {
                stats.total_interactions === 0 && (

                    <Alert
                        severity="info"
                        sx={{
                            mt: 3,
                            mb: 3,
                            borderRadius: 3
                        }}
                    >

                        No interaction data available.

                    </Alert>

                )
            }

            {/* =========================================================
            KPI Cards
        ========================================================== */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#1565C0,#42A5F5)",
                            color: "#fff",
                            boxShadow: "0 10px 25px rgba(21,101,192,.25)",
                            transition: ".25s",
                            "&:hover": {
                                transform: "translateY(-5px)"
                            }
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    opacity: .9,
                                    letterSpacing: 1
                                }}
                            >
                                TOTAL HCPs
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{ mt: 1 }}
                            >
                                {stats.total_hcps}
                            </Typography>

                            <Divider
                                sx={{
                                    my: 2,
                                    bgcolor: "rgba(255,255,255,.2)"
                                }}
                            />

                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: .9
                                }}
                            >
                                Registered Healthcare Professionals
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#00897B,#26A69A)",
                            color: "#fff",
                            boxShadow: "0 10px 25px rgba(0,137,123,.25)",
                            transition: ".25s",
                            "&:hover": {
                                transform: "translateY(-5px)"
                            }
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    opacity: .9,
                                    letterSpacing: 1
                                }}
                            >
                                TOTAL INTERACTIONS
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{ mt: 1 }}
                            >
                                {stats.total_interactions}
                            </Typography>

                            <Divider
                                sx={{
                                    my: 2,
                                    bgcolor: "rgba(255,255,255,.2)"
                                }}
                            />

                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: .9
                                }}
                            >
                                Meetings, Calls & Follow-ups Logged
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>
            {/* =========================================================
            Analytics Overview
        ========================================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    color: "#0F172A",
                    mb: 3
                }}
            >
                Analytics Overview
            </Typography>

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >

                {/* ==============================================
                Product Distribution
            ============================================== */}

                <Grid
                    item
                    xs={12}
                    lg={6}
                >

                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            border: "1px solid #E2E8F0",
                            background:
                                "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
                            boxShadow:
                                "0 8px 24px rgba(15,23,42,0.08)",
                            transition: ".25s",
                            "&:hover": {
                                boxShadow:
                                    "0 12px 30px rgba(15,23,42,0.15)"
                            }
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="#0F172A"
                                >
                                    Product Distribution
                                </Typography>

                                <Chip
                                    size="small"
                                    label="Live"
                                    color="success"
                                />

                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <ProductPieChart
                                products={stats.products}
                            />

                        </CardContent>

                    </Card>

                </Grid>

                {/* ==============================================
                Monthly Trend
            ============================================== */}

                <Grid
                    item
                    xs={12}
                    lg={6}
                >

                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            border: "1px solid #E2E8F0",
                            background:
                                "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
                            boxShadow:
                                "0 8px 24px rgba(15,23,42,0.08)",
                            transition: ".25s",
                            "&:hover": {
                                boxShadow:
                                    "0 12px 30px rgba(15,23,42,0.15)"
                            }
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="#0F172A"
                                >
                                    Monthly Interaction Trend
                                </Typography>

                                <Chip
                                    size="small"
                                    label="12 Months"
                                    color="primary"
                                />

                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <InteractionTrend
                                monthlyData={monthlyData}
                            />

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* =========================================================
            Insights Banner
        ========================================================== */}

            <Card
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg,#EEF6FF,#F8FBFF)",
                    border: "1px solid #D6E4FF",
                    boxShadow:
                        "0 6px 18px rgba(21,101,192,.08)"
                }}
            >

                <CardContent>

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Active Products
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="primary"
                            >
                                {Object.keys(stats.products || {}).length}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Latest Update
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                {lastUpdated}
                            </Typography>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                API Response Time
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                                color="success.main"
                            >
                                {responseTime || "--"} sec
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>
            {/* =========================================================
            Recent Interactions
        ========================================================== */}

            <Card
                sx={{
                    borderRadius: 4,
                    border: "1px solid #E2E8F0",
                    boxShadow:
                        "0 8px 24px rgba(15,23,42,0.08)",
                    mb: 4,
                    overflow: "hidden"
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3
                        }}
                    >

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#0F172A"
                            >
                                Recent Interactions
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Latest 5 doctor interactions recorded in the CRM.
                            </Typography>

                        </Box>

                        <Chip
                            label={`${stats.recent_interactions?.length || 0} Records`}
                            color="primary"
                            variant="outlined"
                        />

                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <RecentInteractionsTable
                        interactions={
                            stats.recent_interactions || []
                        }
                    />

                </CardContent>

            </Card>

            {/* =========================================================
            Export Section
        ========================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    mb: 4
                }}
            >

                <Button
                    variant="outlined"
                    color="success"
                    size="large"
                    startIcon={<DownloadIcon />}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                    onClick={() => {

                        const dashboardReport = {

                            generated_at:
                                new Date().toLocaleString(),

                            total_hcps:
                                stats.total_hcps,

                            total_interactions:
                                stats.total_interactions,

                            products:
                                stats.products,

                            monthly_trend:
                                monthlyData,

                            recent_interactions:
                                stats.recent_interactions

                        };

                        const blob = new Blob(

                            [

                                JSON.stringify(
                                    dashboardReport,
                                    null,
                                    4
                                )

                            ],

                            {

                                type: "application/json"

                            }

                        );

                        const url =
                            window.URL.createObjectURL(blob);

                        const link =
                            document.createElement("a");

                        link.href = url;

                        link.download =
                            "dashboard-report.json";

                        document.body.appendChild(link);

                        link.click();

                        document.body.removeChild(link);

                        window.URL.revokeObjectURL(url);

                    }}
                >

                    Export Dashboard Report

                </Button>

            </Box>

        </Box>

    );

}

export default DashboardAnalytics;