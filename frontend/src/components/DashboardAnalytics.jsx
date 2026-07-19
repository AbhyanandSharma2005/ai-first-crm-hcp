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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import API from "../api/api";

import DashboardFilters from "./DashboardFilters";
import DashboardKPICards from "./DashboardKPICards";
import ProductPieChart from "./ProductPieChart";
import InteractionTrend from "./InteractionTrend";
import RecentInteractionsTable from "./RecentInteractionsTable";
import TopDoctorsChart from "./TopDoctorsChart";

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
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<DownloadIcon />}
                                onClick={exportCSV}
                                sx={{
                                    borderColor: "#86EFAC",
                                    color: "#166534",
                                    fontWeight: 700,
                                    "&:hover": {
                                        borderColor: "#4ADE80",
                                        bgcolor: "rgba(240, 253, 244, 0.16)"
                                    }
                                }}
                            >
                                Export CSV
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={exportPDF}
                                sx={{
                                    ml: 2,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600
                                }}
                            >
                                Export PDF
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

            {/* =========================================================
            KPI Cards
        ========================================================== */}

            <Box sx={{ mt: 4 }}>
                <DashboardKPICards />
            </Box>

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
            KPI Cards (Legacy - Remove these when DashboardKPICards is fully integrated)
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
            Top Doctors Chart
        ========================================================== */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >

                <Grid
                    item
                    xs={12}
                >

                    <TopDoctorsChart />

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
                    mb: 4,
                    mt: 4
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
                <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={exportPDF}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Export PDF
                </Button>

            </Box>

        </Box>

    );

}

export default DashboardAnalytics;