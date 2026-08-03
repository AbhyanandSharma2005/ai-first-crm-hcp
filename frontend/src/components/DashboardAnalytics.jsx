import { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    Chip,
    Divider,
    Tooltip
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import API from "../api/api";
import useDashboardSocket from "../hooks/useDashboardSocket";

import DashboardFilters from "./DashboardFilters";
import DashboardKPICards from "./DashboardKPICards";
import ProductPieChart from "./ProductPieChart";
import InteractionTrend from "./InteractionTrend";
import RecentInteractionsTable from "./RecentInteractionsTable";
import TopDoctorsChart from "./TopDoctorsChart";
import ProductLeaderboard from "./ProductLeaderboard";
import DoctorHeatmap from "./DoctorHeatmap";
import LoadingCards from "./LoadingCards";
import LoadingChart from "./LoadingChart";
import LoadingTable from "./LoadingTable";
import EmptyState from "./EmptyState";

//-----------------------------------------------------
// Shared Design-System Style Fragments
// (Phase 13.8.14.1 - Consistent Design System)
//-----------------------------------------------------

//-----------------------------------------------------
// Typography Scale
// (Step 16 - Better Typography)
//-----------------------------------------------------

const typographyScale = {
    pageTitle: { fontSize: "34px" },
    sectionTitle: { fontSize: "24px" },
    body: { fontSize: "16px" },
    caption: { fontSize: "14px" }
};

//-----------------------------------------------------
// Chart Sizing
// (Step 7 - Increase Chart Height)
//-----------------------------------------------------

const CHART_HEIGHT = 360;

//-----------------------------------------------------
// Card Sizing
// (Step 12 - Bigger Cards)
//-----------------------------------------------------

const cardMinHeights = {
    metrics: 170,
    analytics: 450,
    search: 380,
    history: 450
};

//-----------------------------------------------------
// Reusable Animation Fragments
// (Phase 13.8.14.7 - Motion Design System)
//-----------------------------------------------------

// Step 15 — Consistent Shadow: boxShadow: 2, hover boxShadow: 8 + translateY(-4px)
const cardAnimation = {
    transition: "all 0.3s ease-in-out",
    boxShadow: 2,

    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
        transform: "none"
    },

    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 8
    }
};

// Step 5 — Increase Card Heights: CRM dashboards breathe more.
// padding: 2 -> padding: 3 across card content
const cardContentAnimationSx = {
    transition: "all .3s",
    padding: 3,
    ".MuiTypography-root": {
        transition: "all .25s"
    }
};

const chipHoverSx = {
    transition: "all .25s",
    "&:hover": {
        transform: "scale(1.05)"
    }
};

const buttonHoverSx = {
    transition: "all .25s",
    "&:hover": {
        transform: "translateY(-2px)"
    }
};

//-----------------------------------------------------
// Accessibility - Focus Visibility
// (Phase 13.8.14.9.8 - Improve Focus Visibility)
//-----------------------------------------------------

const focusVisibleSx = {
    "&:focus-visible": {
        outline: "3px solid #1976D2",
        outlineOffset: 2,
        borderRadius: 6
    }
};

const standardCardSx = {
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    ...cardAnimation,
    ...focusVisibleSx
};

const standardContainedButtonSx = {
    borderRadius: 3,
    px: 3,
    py: 1.25,
    textTransform: "none",
    fontWeight: 700,
    ...buttonHoverSx,
    ...focusVisibleSx
};

const standardOutlinedButtonSx = {
    borderRadius: 3,
    textTransform: "none",
    fontWeight: 700,
    ...buttonHoverSx,
    ...focusVisibleSx
};

// Step 5 — Increase Card Heights: borderRadius: 2 -> borderRadius: 4
const standardChipSx = {
    fontWeight: 700,
    borderRadius: 4,
    ...chipHoverSx
};

const standardGridSpacing = {
    xs: 2,
    sm: 2.5,
    md: 3
};

const standardSectionSpacing = {
    xs: 3,
    md: 5
};

//-----------------------------------------------------
// Chart Color Palette
// (Phase 13.8.14.8.2 - Better Color Palette)
//-----------------------------------------------------

const CHART_COLORS = [
    "#2563EB",
    "#14B8A6",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#22C55E",
    "#EAB308",
    "#EF4444"
];

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
    // WebSocket Connection for Real-time Updates
    //-----------------------------------------------------

    const handleWebSocketUpdate = (data) => {
        console.log("📡 WebSocket update received:", data);

        // Refresh both dashboard stats and monthly trend
        fetchDashboardStats();
        fetchMonthlyTrend();

        // Update last updated timestamp
        setLastUpdated(new Date().toLocaleTimeString());
    };

    // Connect to WebSocket and get connection status
    const isConnected = useDashboardSocket(
        handleWebSocketUpdate,
        {
            reconnectInterval: 3000,
            autoConnect: true
        }
    );

    // Log WebSocket connection status
    useEffect(() => {
        if (isConnected) {
            console.log("✅ Dashboard WebSocket connected and listening for updates");
        } else {
            console.log("🔴 Dashboard WebSocket disconnected");
        }
    }, [isConnected]);

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

    const exportCSV = () => {

        const headers = [
            "ID",
            "Doctor",
            "Product",
            "Summary",
            "Follow Up"
        ];

        const interactionsToExport = stats?.recent_interactions || [];

        const escapeCSV = (value) => {

            if (value === null || value === undefined) {
                return "";
            }

            return `"${String(value).replace(/"/g, '""')}"`;

        };

        const rows = interactionsToExport.map(
            (interaction) => [
                escapeCSV(interaction.id),
                escapeCSV(interaction.hcp_name),
                escapeCSV(interaction.product),
                escapeCSV(interaction.summary),
                escapeCSV(interaction.follow_up)
            ]
        );

        const csvContent = [
            headers,
            ...rows
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "dashboard_report.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    };

    //-----------------------------------------------------
    // PDF Export Function
    //-----------------------------------------------------

    const exportPDF = () => {

        const doc = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });

        //----------------------------------------------------
        // Colors
        //----------------------------------------------------

        const primaryColor = [25, 118, 210];

        const secondaryColor = [71, 85, 105];

        const lightColor = [245, 247, 250];

        //----------------------------------------------------
        // Report Header
        //----------------------------------------------------

        doc.setFillColor(...primaryColor);

        doc.rect(

            0,

            0,

            210,

            28,

            "F"

        );

        doc.setTextColor(255, 255, 255);

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(20);

        doc.text(

            "AI-First CRM HCP Dashboard",

            14,

            16

        );

        doc.setFontSize(10);

        doc.text(

            "Dashboard Analytics Report",

            14,

            23

        );

        //----------------------------------------------------
        // Metadata
        //----------------------------------------------------

        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10);

        doc.text(

            `Generated : ${new Date().toLocaleString()}`,

            14,

            38

        );

        doc.text(

            `Last Updated : ${lastUpdated || "-"}`,

            14,

            44

        );

        doc.text(

            `Backend Response : ${responseTime || "-"} sec`,

            14,

            50

        );

        //----------------------------------------------------
        // Divider
        //----------------------------------------------------

        doc.setDrawColor(220);

        doc.line(

            14,

            55,

            196,

            55

        );

        //----------------------------------------------------
        // Dashboard Summary
        //----------------------------------------------------

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(16);

        doc.text(

            "Dashboard Overview",

            14,

            66

        );

        doc.setFont(

            "helvetica",

            "normal"

        );

        doc.setFontSize(11);

        doc.text(

            "This report summarizes the current Healthcare Professional CRM dashboard.",

            14,

            74

        );

        doc.text(

            "It includes interaction statistics, products, trends and recent activities.",

            14,

            80

        );

        //----------------------------------------------------
        // KPI Section
        //----------------------------------------------------

        doc.setFillColor(...lightColor);

        doc.roundedRect(

            14,

            90,

            182,

            42,

            3,

            3,

            "F"

        );

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(14);

        doc.text(

            "Key Performance Indicators",

            18,

            100

        );

        doc.setFont(

            "helvetica",

            "normal"

        );

        doc.setFontSize(12);

        doc.text(

            `Total HCPs : ${stats.total_hcps}`,

            20,

            112

        );

        doc.text(

            `Total Interactions : ${stats.total_interactions}`,

            20,

            120

        );

        doc.text(

            `Unique Products : ${

                Object.keys(

                    stats.products || {}

                ).length

            }`,

            110,

            112

        );

        doc.text(

            `Report Status : Active`,

            110,

            120

        );

        //----------------------------------------------------
        // Product Distribution Summary
        //----------------------------------------------------

        let yPosition = 145;

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(14);

        doc.text(

            "Product Distribution",

            14,

            yPosition

        );

        yPosition += 10;

        doc.setFont(

            "helvetica",

            "normal"

        );

        Object.entries(

            stats.products || {}

        ).forEach(

            ([product, count]) => {

                doc.text(

                    `${product} : ${count} interactions`,

                    20,

                    yPosition

                );

                yPosition += 8;

            }

        );

        //----------------------------------------------------
        // Recent Interactions Table
        //----------------------------------------------------

        yPosition += 10;

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(14);

        doc.text(

            "Recent Interactions",

            14,

            yPosition

        );

        yPosition += 6;

        const interactionRows = (

            stats.recent_interactions || []

        ).map((interaction) => [

            interaction.id ?? "-",

            interaction.hcp_name ?? "Unknown",

            interaction.product ?? "N/A",

            interaction.summary ?? "N/A",

            interaction.follow_up

                ? new Date(

                      interaction.follow_up

                  ).toLocaleDateString()

                : "Not Scheduled"

        ]);

        autoTable(doc, {

            startY: yPosition,

            head: [[

                "ID",

                "Doctor",

                "Product",

                "Summary",

                "Follow-up"

            ]],

            body: interactionRows,

            theme: "grid",

            headStyles: {

                fillColor: [25,118,210],

                textColor: [255,255,255],

                fontStyle: "bold",

                halign: "center"

            },

            bodyStyles: {

                fontSize: 9,

                valign: "middle"

            },

            alternateRowStyles: {

                fillColor: [248,250,252]

            },

            styles: {

                cellPadding: 3,

                overflow: "linebreak"

            },

            columnStyles: {

                0: {

                    cellWidth: 15,

                    halign: "center"

                },

                1: {

                    cellWidth: 35

                },

                2: {

                    cellWidth: 30

                },

                3: {

                    cellWidth: 70

                },

                4: {

                    cellWidth: 35

                }

            }

        });

        yPosition = doc.lastAutoTable.finalY + 12;

        //----------------------------------------------------
        // Product Analytics (New Page)
        //----------------------------------------------------

        doc.addPage();

        let pageY = 20;

        doc.setFont(

            "helvetica",

            "bold"

        );

        doc.setFontSize(18);

        doc.setTextColor(...primaryColor);

        doc.text(

            "Product Analytics",

            14,

            pageY

        );

        pageY += 12;

        doc.setFontSize(12);

        doc.setTextColor(...secondaryColor);

        doc.text(

            "Product Distribution Summary",

            14,

            pageY

        );

        pageY += 10;

        Object.entries(stats.products || {}).forEach(

            ([product, count]) => {

                doc.setDrawColor(220);

                doc.roundedRect(

                    14,

                    pageY - 5,

                    182,

                    10,

                    2,

                    2

                );

                doc.setTextColor(...primaryColor);

                doc.text(

                    product,

                    20,

                    pageY + 1

                );

                doc.setTextColor(...secondaryColor);

                doc.text(

                    `${count} Interactions`,

                    145,

                    pageY + 1

                );

                pageY += 14;

            }

        );

        //----------------------------------------------------
        // Monthly Trend
        //----------------------------------------------------

        pageY += 8;

        doc.setFontSize(16);

        doc.setTextColor(...primaryColor);

        doc.text(

            "Monthly Interaction Trend",

            14,

            pageY

        );

        pageY += 8;

        autoTable(doc, {

            startY: pageY,

            head: [[

                "Month",

                "Interactions"

            ]],

            body: monthlyData.map(item => [

                item.month,

                item.count

            ]),

            headStyles: {

                fillColor: [25,118,210],

                textColor: [255,255,255]

            },

            alternateRowStyles: {

                fillColor: [248,250,252]

            },

            theme: "striped"

        });

        pageY = doc.lastAutoTable.finalY + 15;

        //----------------------------------------------------
        // Executive Summary
        //----------------------------------------------------

        doc.setFontSize(16);

        doc.setTextColor(...primaryColor);

        doc.text(

            "Executive Summary",

            14,

            pageY

        );

        pageY += 10;

        doc.setFontSize(11);

        doc.setTextColor(...secondaryColor);

        doc.text(

            `• Total Healthcare Professionals : ${stats.total_hcps}`,

            20,

            pageY

        );

        pageY += 8;

        doc.text(

            `• Total Interactions : ${stats.total_interactions}`,

            20,

            pageY

        );

        pageY += 8;

        doc.text(

            `• Total Products : ${Object.keys(stats.products || {}).length}`,

            20,

            pageY

        );

        pageY += 8;

        doc.text(

            `• Report Generated : ${new Date().toLocaleString()}`,

            20,

            pageY

        );

        //----------------------------------------------------
        // Footer on Every Page
        //----------------------------------------------------

        const pageCount = doc.getNumberOfPages();

        for (

            let i = 1;

            i <= pageCount;

            i++

        ) {

            doc.setPage(i);

            const pageHeight =

                doc.internal.pageSize.height;

            doc.setDrawColor(220);

            doc.line(

                14,

                pageHeight - 15,

                196,

                pageHeight - 15

            );

            doc.setFontSize(9);

            doc.setTextColor(...secondaryColor);

            doc.text(

                "AI-First CRM HCP Dashboard",

                14,

                pageHeight - 8

            );

            doc.text(

                `Page ${i} of ${pageCount}`,

                170,

                pageHeight - 8

            );

        }

        //----------------------------------------------------
        // Save PDF
        //----------------------------------------------------

        doc.save(

            "dashboard_report.pdf"

        );

    };

    //-----------------------------------------------------
    // Loading
    //-----------------------------------------------------

    if (loading) {

        return (

            <Box sx={{ mt: 4 }}>

                <LoadingCards />

                <Box sx={{ mt: 4 }}>

                    <LoadingChart />

                </Box>

                <Box sx={{ mt: 4 }}>

                    <LoadingTable />

                </Box>

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

                    borderRadius: 4

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

            <EmptyState
                title="No Dashboard Data"
                description="Dashboard statistics will appear once interactions are recorded."
            />

        );

    }

    //-----------------------------------------------------
    // Main UI
    //-----------------------------------------------------

    return (

        <Box

            sx={{

                mt: standardSectionSpacing,

                pb: 5

            }}

        >
            {/* =========================================================
            Header
        ========================================================== */}

            <Card
                sx={{
                    mb: standardSectionSpacing,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg,#0F172A 0%, #1E3A8A 100%)",
                    color: "#ffffff",
                    boxShadow: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease-in-out",
                    "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                        transform: "none"
                    },
                    "&:hover": {
                        background:
                            "linear-gradient(135deg,#ffffff,#F8FBFF)",
                        transform: "translateY(-4px)",
                        boxShadow: 8
                    }
                }}
            >

                <CardContent sx={cardContentAnimationSx}>

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
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: "-0.03em",
                                        ...typographyScale.pageTitle
                                    }}
                                >
                                    Dashboard Analytics
                                </Typography>

                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    opacity: 0.9,
                                    ...typographyScale.body
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

                            {/* Connection Status Chip */}
                            <Chip
                                label={isConnected ? "Live" : "Offline"}
                                aria-label={`System Status ${isConnected ? "Live" : "Offline"}`}
                                color={isConnected ? "success" : "error"}
                                size="small"
                                sx={{
                                    ...standardChipSx,
                                    "& .MuiChip-label": {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5
                                    }
                                }}
                            />

                            <Chip
                                icon={<AccessTimeIcon />}
                                label={`Updated : ${lastUpdated || "--"}`}
                                aria-label={`Dashboard updated at ${lastUpdated || "unknown time"}`}
                                size="small"
                                sx={{
                                    ...standardChipSx,
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    color: "#fff"
                                }}
                            />

                            <Chip
                                icon={<SpeedIcon />}
                                label={`Response : ${responseTime || "--"} sec`}
                                aria-label={`API response time ${responseTime || "unknown"} seconds`}
                                size="small"
                                sx={{
                                    ...standardChipSx,
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    color: "#fff"
                                }}
                            />

                            <Tooltip title="Refresh">
                                <Button
                                    variant="contained"
                                    startIcon={<RefreshIcon />}
                                    onClick={fetchDashboardStats}
                                    aria-label="Refresh Dashboard Data"
                                    sx={{
                                        ...standardContainedButtonSx,
                                        bgcolor: "#ffffff",
                                        color: "#1565C0",
                                        "&:hover": {
                                            ...buttonHoverSx["&:hover"],
                                            bgcolor: "#E3F2FD"
                                        }
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Tooltip>
                            <Tooltip title="Export CSV">
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportCSV}
                                    aria-label="Export Dashboard CSV"
                                    sx={{
                                        ...standardOutlinedButtonSx,
                                        borderColor: "#86EFAC",
                                        color: "#166534",
                                        "&:hover": {
                                            ...buttonHoverSx["&:hover"],
                                            borderColor: "#4ADE80",
                                            bgcolor: "rgba(240, 253, 244, 0.16)"
                                        }
                                    }}
                                >
                                    Export CSV
                                </Button>
                            </Tooltip>
                            <Tooltip title="Export PDF">
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={exportPDF}
                                    aria-label="Export Dashboard PDF"
                                    sx={{
                                        ...standardContainedButtonSx,
                                        ml: 2
                                    }}
                                >
                                    Export PDF
                                </Button>
                            </Tooltip>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

            {/* =========================================================
            KPI Cards
        ========================================================== */}

            <Box sx={{ mt: standardSectionSpacing }}>
                <DashboardKPICards />
            </Box>

            {/* =========================================================
            Dashboard Filters (Search)
        ========================================================== */}

            <Box sx={{ minHeight: cardMinHeights.search }}>
                <DashboardFilters
                    onApply={setFilters}
                />
            </Box>

            {/* =========================================================
            Empty State
        ========================================================== */}

            {
                stats.total_interactions === 0 && (

                    <EmptyState
                        icon={AnalyticsOutlinedIcon}
                        title="No Interactions Yet"
                        description="Log your first doctor interaction to populate dashboard analytics."
                    />

                )
            }

            {/* =========================================================
            KPI Cards (Legacy - Remove these when DashboardKPICards is fully integrated)
        ========================================================== */}

            <Grid
                container
                spacing={standardGridSpacing}
                sx={{ mb: standardSectionSpacing }}
            >

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Card
                        tabIndex={0}
                        role="article"
                        aria-label="Analytics Card: Total HCPs"
                        sx={{
                            minHeight: cardMinHeights.metrics,
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#1565C0,#42A5F5)",
                            color: "#fff",
                            boxShadow: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease-in-out",
                            "@media (prefers-reduced-motion: reduce)": {
                                transition: "none",
                                transform: "none"
                            },
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg,#ffffff,#F8FBFF)",
                                transform: "translateY(-4px)",
                                boxShadow: 8
                            },
                            ...focusVisibleSx
                        }}
                    >

                        <CardContent sx={cardContentAnimationSx}>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    opacity: .9,
                                    letterSpacing: 1,
                                    ...typographyScale.caption
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
                                    opacity: .9,
                                    ...typographyScale.body
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
                        tabIndex={0}
                        role="article"
                        aria-label="Analytics Card: Total Interactions"
                        sx={{
                            minHeight: cardMinHeights.metrics,
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#00897B,#26A69A)",
                            color: "#fff",
                            boxShadow: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease-in-out",
                            "@media (prefers-reduced-motion: reduce)": {
                                transition: "none",
                                transform: "none"
                            },
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg,#ffffff,#F8FBFF)",
                                transform: "translateY(-4px)",
                                boxShadow: 8
                            },
                            ...focusVisibleSx
                        }}
                    >

                        <CardContent sx={cardContentAnimationSx}>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    opacity: .9,
                                    letterSpacing: 1,
                                    ...typographyScale.caption
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
                                    opacity: .9,
                                    ...typographyScale.body
                                }}
                            >
                                Meetings, Calls & Follow-ups Logged
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* =========================================================
            Top Doctors Chart
        ========================================================== */}

            <Grid
                container
                spacing={standardGridSpacing}
                sx={{ mb: standardSectionSpacing }}
            >

                <Grid
                    item
                    xs={12}
                >

                    <Card
                        tabIndex={0}
                        role="article"
                        aria-label="Analytics Card: Top Doctors"
                        sx={{
                            ...standardCardSx,
                            minHeight: cardMinHeights.analytics
                        }}
                    >
                        <CardContent sx={cardContentAnimationSx}>
                            <TopDoctorsChart height={CHART_HEIGHT} />
                        </CardContent>
                    </Card>

                </Grid>

            </Grid>

            {/* =========================================================
            Product Leaderboard
        ========================================================== */}

            <Box sx={{ mt: standardSectionSpacing }}>
                <Card
                    tabIndex={0}
                    role="article"
                    aria-label="Analytics Card: Product Leaderboard"
                    sx={{
                        ...standardCardSx,
                        minHeight: cardMinHeights.analytics
                    }}
                >
                    <CardContent sx={cardContentAnimationSx}>
                        <ProductLeaderboard height={CHART_HEIGHT} />
                    </CardContent>
                </Card>
            </Box>

            {/* =========================================================
            Doctor Activity Heatmap
        ========================================================== */}

            <Box sx={{ mt: standardSectionSpacing }}>
                <Card
                    tabIndex={0}
                    role="article"
                    aria-label="Analytics Card: Doctor Activity Heatmap"
                    sx={{
                        ...standardCardSx,
                        minHeight: cardMinHeights.analytics
                    }}
                >
                    <CardContent sx={cardContentAnimationSx}>
                        <DoctorHeatmap height={CHART_HEIGHT} />
                    </CardContent>
                </Card>
            </Box>

            {/* =========================================================
            Analytics Overview
        ========================================================== */}

            <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                    color: "#0F172A",
                    mb: 2,
                    mt: standardSectionSpacing,
                    ...typographyScale.sectionTitle
                }}
            >
                Analytics Overview
            </Typography>

            <Grid
                container
                spacing={standardGridSpacing}
                sx={{ mb: standardSectionSpacing }}
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
                        tabIndex={0}
                        role="article"
                        aria-label="Analytics Card: Product Distribution"
                        sx={{
                            ...standardCardSx,
                            minHeight: cardMinHeights.analytics,
                            overflow: "hidden"
                        }}
                    >

                        <CardContent sx={cardContentAnimationSx}>

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
                                    sx={{ mb: 2, ...typographyScale.sectionTitle }}
                                >
                                    Product Distribution
                                </Typography>

                                <Chip
                                    size="small"
                                    label="Live"
                                    aria-label="Product Distribution Status Live"
                                    color="success"
                                    sx={standardChipSx}
                                />

                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/*
                                Note: ProductPieChart renders the Recharts
                                <ResponsiveContainer>. Add the following
                                props inside that component:
                                <ResponsiveContainer
                                    aria-label="Product Distribution Chart"
                                    role="img"
                                >
                            */}
                            <ProductPieChart
                                products={stats.products}
                                colors={CHART_COLORS}
                                height={CHART_HEIGHT}
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
                        tabIndex={0}
                        role="article"
                        aria-label="Analytics Card: Monthly Interaction Trend"
                        sx={{
                            ...standardCardSx,
                            minHeight: cardMinHeights.analytics,
                            overflow: "hidden"
                        }}
                    >

                        <CardContent sx={cardContentAnimationSx}>

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
                                    sx={{ mb: 2, ...typographyScale.sectionTitle }}
                                >
                                    Monthly Interaction Trend
                                </Typography>

                                <Chip
                                    size="small"
                                    label="12 Months"
                                    aria-label="Showing 12 Months of Data"
                                    color="primary"
                                    sx={standardChipSx}
                                />

                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/*
                                Note: InteractionTrend renders the Recharts
                                <ResponsiveContainer>. Add the following
                                props inside that component:
                                <ResponsiveContainer
                                    aria-label="Monthly Interaction Trend"
                                    role="img"
                                >
                            */}
                            <InteractionTrend
                                monthlyData={monthlyData}
                                colors={CHART_COLORS}
                                height={CHART_HEIGHT}
                            />

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* =========================================================
            Insights Banner
        ========================================================== */}

            <Card
                tabIndex={0}
                role="article"
                aria-label="Analytics Card: Dashboard Insights"
                sx={{
                    mb: standardSectionSpacing,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg,#EEF6FF,#F8FBFF)",
                    border: "1px solid #D6E4FF",
                    ...cardAnimation,
                    ...focusVisibleSx
                }}
            >

                <CardContent sx={cardContentAnimationSx}>

                    <Grid
                        container
                        spacing={standardGridSpacing}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="subtitle2"
                                sx={{ color: "#475569", ...typographyScale.caption }}
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
                                sx={{ color: "#475569", ...typographyScale.caption }}
                            >
                                Latest Update
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ mb: 2 }}
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
                                sx={{ color: "#475569", ...typographyScale.caption }}
                            >
                                API Response Time
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                                color="success.main"
                                sx={{ mb: 2 }}
                            >
                                {responseTime || "--"} sec
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>
            {/* =========================================================
            Recent Interactions (History)
        ========================================================== */}

            <Card
                tabIndex={0}
                role="article"
                aria-label="Analytics Card: Recent Interactions"
                sx={{
                    ...standardCardSx,
                    minHeight: cardMinHeights.history,
                    mb: standardSectionSpacing,
                    overflow: "hidden"
                }}
            >

                <CardContent sx={cardContentAnimationSx}>

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
                                variant="subtitle2"
                                fontWeight={700}
                                color="#0F172A"
                                sx={typographyScale.caption}
                            >
                                Recent Interactions
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "#475569", ...typographyScale.body }}
                            >
                                Latest 5 doctor interactions recorded in the CRM.
                            </Typography>

                        </Box>

                        <Chip
                            label={`${stats.recent_interactions?.length || 0} Records`}
                            aria-label={`${stats.recent_interactions?.length || 0} interaction records shown`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={standardChipSx}
                        />

                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/*
                        Note: RecentInteractionsTable renders the MUI
                        <Table>. Add the following prop inside that
                        component:
                        <Table aria-label="Recent Interaction Table">
                    */}
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
                    mb: standardSectionSpacing,
                    mt: standardSectionSpacing
                }}
            >

                <Tooltip title="Export">
                    <Button
                        variant="outlined"
                        color="success"
                        size="large"
                        startIcon={<DownloadIcon />}
                        aria-label="Export Dashboard Report as JSON"
                        sx={standardOutlinedButtonSx}
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
                </Tooltip>
                <Tooltip title="Export PDF">
                    <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={exportPDF}
                        aria-label="Export Dashboard PDF"
                        sx={standardOutlinedButtonSx}
                    >
                        Export PDF
                    </Button>
                </Tooltip>

            </Box>

        </Box>

    );

}

export default DashboardAnalytics;
