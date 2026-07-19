import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Skeleton,
    Alert,
    Chip,
    Divider,
    Tooltip,
    Avatar,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    Whatshot as WhatshotIcon
} from "@mui/icons-material";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

//-----------------------------------------------------
// DoctorHeatmap Component
//-----------------------------------------------------

function DoctorHeatmap() {
    const theme = useTheme();
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [maxValue, setMaxValue] = useState(0);

    // Theme colors
    const cardBg = isDark ? "#1E293B" : "#FFFFFF";
    const borderColor = isDark ? "#334155" : "#E2E8F0";
    const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
    const textSecondary = isDark ? "#94A3B8" : "#475569";
    const dividerColor = isDark ? "#334155" : "#E2E8F0";
    const headerBg = isDark ? "#0F172A" : "#F8FAFC";
    const rowHoverBg = isDark ? "#1E293B" : "#F8FAFC";

    // Responsive settings
    const maxDisplayRows = isMobile ? 5 : 10;

    //-----------------------------------------------------
    // Fetch Heatmap Data
    //-----------------------------------------------------

    const fetchHeatmap = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(

                "/dashboard/doctor-heatmap"

            );

            if (

                response.data.success &&

                response.data.data &&

                response.data.data.heatmap

            ) {

                const heatmapData = response.data.data.heatmap;
                // Limit rows on mobile for better display
                const displayData = isMobile ? heatmapData.slice(0, 5) : heatmapData;
                setData(displayData);

                // Calculate max value for color intensity
                let max = 0;
                displayData.forEach(row => {
                    const values = [
                        row.monday,
                        row.tuesday,
                        row.wednesday,
                        row.thursday,
                        row.friday,
                        row.saturday,
                        row.sunday
                    ];
                    const rowMax = Math.max(...values);
                    if (rowMax > max) max = rowMax;
                });
                setMaxValue(max);

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load heatmap data."

                );

            }

        }

        catch (err) {

            console.error("Heatmap fetch error:", err);

            setError(

                err.response?.data?.message ||

                "Unable to load heatmap data."

            );

        }

        finally {

            setLoading(false);

        }

    };

    //-----------------------------------------------------
    // Initial Load
    //-----------------------------------------------------

    useEffect(() => {

        fetchHeatmap();

    }, [isMobile]);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchHeatmap();

        }, 30000);

        return () => clearInterval(interval);

    }, [isMobile]);

    //-----------------------------------------------------
    // Color Helper with Gradient
    //-----------------------------------------------------

    const getColor = (count) => {

        if (count === 0) return isDark ? "#1E293B" : "#F1F5F9";

        const intensity = maxValue > 0 ? count / maxValue : 0;

        if (intensity >= 0.8) return "#1E40AF";
        if (intensity >= 0.6) return "#2563EB";
        if (intensity >= 0.4) return "#60A5FA";
        if (intensity >= 0.2) return "#93C5FD";
        return "#DBEAFE";

    };

    //-----------------------------------------------------
    // Get Text Color based on background
    //-----------------------------------------------------

    const getTextColor = (count) => {

        if (count === 0) return isDark ? "#94A3B8" : "#64748B";

        const intensity = maxValue > 0 ? count / maxValue : 0;

        if (intensity >= 0.6) return "#FFFFFF";

        return isDark ? "#F1F5F9" : "#0F172A";

    };

    //-----------------------------------------------------
    // Get Day Abbreviation
    //-----------------------------------------------------

    const getDayLabel = (day) => {
        const days = {
            monday: "Mon",
            tuesday: "Tue",
            wednesday: "Wed",
            thursday: "Thu",
            friday: "Fri",
            saturday: "Sat",
            sunday: "Sun"
        };
        return days[day] || day;
    };

    //-----------------------------------------------------
    // Get Full Day Name
    //-----------------------------------------------------

    const getFullDayName = (day) => {
        const days = {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
        };
        return days[day] || day;
    };

    //-----------------------------------------------------
    // Calculate Total Interactions for a Doctor
    //-----------------------------------------------------

    const getDoctorTotal = (row) => {
        return row.monday + row.tuesday + row.wednesday + 
               row.thursday + row.friday + row.saturday + row.sunday;
    };

    //-----------------------------------------------------
    // Loading State
    //-----------------------------------------------------

    if (loading) {

        return (

            <Card

                sx={{

                    height: "100%",

                    borderRadius: 4,

                    border: `1px solid ${borderColor}`,

                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
                    backgroundColor: cardBg,

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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

                            >

                                Doctor Activity Heatmap

                            </Typography>
                        </Box>

                        <Chip

                            size="small"

                            label="Loading..."

                            color="default"

                        />

                    </Box>

                    <Divider sx={{ mb: 3, borderColor: dividerColor }} />

                    <Skeleton

                        variant="rounded"

                        height={isMobile ? 200 : 300}

                        sx={{ borderRadius: 2, bgcolor: isDark ? '#334155' : undefined }}

                    />

                </CardContent>

            </Card>

        );

    }

    //-----------------------------------------------------
    // Error State
    //-----------------------------------------------------

    if (error) {

        return (

            <Card

                sx={{

                    height: "100%",

                    borderRadius: 4,

                    border: `1px solid ${borderColor}`,

                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
                    backgroundColor: cardBg,

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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

                            >

                                Doctor Activity Heatmap

                            </Typography>
                        </Box>

                        <Chip

                            size="small"

                            label="Error"

                            color="error"

                        />

                    </Box>

                    <Divider sx={{ mb: 3, borderColor: dividerColor }} />

                    <Alert

                        severity="error"

                        sx={{ borderRadius: 2 }}

                    >

                        {error}

                    </Alert>

                </CardContent>

            </Card>

        );

    }

    //-----------------------------------------------------
    // Empty State
    //-----------------------------------------------------

    if (!data || data.length === 0) {

        return (

            <Card

                sx={{

                    height: "100%",

                    borderRadius: 4,

                    border: `1px solid ${borderColor}`,

                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
                    backgroundColor: cardBg,

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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

                            >

                                Doctor Activity Heatmap

                            </Typography>
                        </Box>

                        <Chip

                            size="small"

                            label="0 Records"

                            color="default"

                        />

                    </Box>

                    <Divider sx={{ mb: 3, borderColor: dividerColor }} />

                    <Alert

                        severity="info"

                        sx={{ borderRadius: 2 }}

                    >

                        No heatmap data available.

                    </Alert>

                </CardContent>

            </Card>

        );

    }

    //-----------------------------------------------------
    // Main UI
    //-----------------------------------------------------

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const displayDays = days;
    const minTableWidth = isMobile ? 600 : 650;

    return (

        <Card

            sx={{

                height: "100%",

                borderRadius: 4,

                border: `1px solid ${borderColor}`,

                background: isDark
                    ? "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)"
                    : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",

                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',

                transition: "0.25s",

                "&:hover": {

                    boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.4)' : '0 12px 30px rgba(15,23,42,0.15)'

                }

            }}

        >

            <CardContent>

                {/* Header */}
                <Box

                    sx={{

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        mb: 2,

                        flexWrap: "wrap",

                        gap: 1

                    }}

                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <WhatshotIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color={textPrimary}
                            sx={{
                                fontSize: isMobile ? "1rem" : "1.25rem"
                            }}

                        >

                            Doctor Activity Heatmap

                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip

                            size="small"

                            label={`${data.length} Doctors`}

                            color="primary"

                            variant="outlined"

                        />
                        <Chip
                            size="small"
                            icon={<TrendingUpIcon />}
                            label="Weekly Activity"
                            color="success"
                            variant="filled"
                            sx={{ fontWeight: 600, display: isMobile ? "none" : "inline-flex" }}
                        />
                    </Box>

                </Box>

                <Divider sx={{ mb: 3, borderColor: dividerColor }} />

                {/* Legend - Show on all devices */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 2 },
                        mb: 2,
                        flexWrap: "wrap"
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Activity Level:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, bgcolor: isDark ? "#1E293B" : "#F1F5F9", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>0</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, bgcolor: "#DBEAFE", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>Low</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, bgcolor: "#93C5FD", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>Medium</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, bgcolor: "#60A5FA", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>High</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, bgcolor: "#2563EB", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>Very High</Typography>
                    </Box>
                </Box>

                {/* Heatmap Table with Horizontal Scroll on Mobile */}
                <TableContainer

                    component={Paper}

                    sx={{

                        borderRadius: 2,

                        border: `1px solid ${borderColor}`,

                        boxShadow: "none",

                        overflowX: "auto",

                        backgroundColor: cardBg,

                        "&::-webkit-scrollbar": {
                            height: 6,
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                            borderRadius: 3,
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: isDark ? "#334155" : "#CBD5E1",
                            borderRadius: 3,
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: isDark ? "#475569" : "#94A3B8",
                        },

                    }}

                >

                    <Table

                        sx={{

                            minWidth: minTableWidth,

                            "& .MuiTableCell-root": {

                                borderBottom: `1px solid ${borderColor}`,

                                py: isMobile ? 1 : 1.5

                            }

                        }}

                    >

                        <TableHead>

                            <TableRow

                                sx={{

                                    bgcolor: headerBg

                                }}

                            >

                                <TableCell

                                    sx={{

                                        fontWeight: 700,

                                        color: textPrimary,

                                        fontSize: isMobile ? "0.75rem" : "0.875rem",

                                        width: isMobile ? 100 : 180,

                                        position: "sticky",

                                        left: 0,

                                        bgcolor: headerBg,

                                        zIndex: 2,

                                        minWidth: isMobile ? 100 : 180,

                                    }}

                                >

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PersonIcon sx={{ fontSize: isMobile ? 14 : 16, color: textSecondary }} />
                                        {!isMobile && "Doctor"}
                                    </Box>

                                </TableCell>

                                {displayDays.map((day, index) => (

                                    <TableCell

                                        key={day}

                                        align="center"

                                        sx={{

                                            fontWeight: 600,

                                            color: textPrimary,

                                            fontSize: isMobile ? "0.65rem" : "0.75rem",

                                            textTransform: "uppercase",

                                            letterSpacing: 0.5,

                                            minWidth: isMobile ? 60 : 80,

                                            px: isMobile ? 0.5 : 1

                                        }}

                                    >

                                        <Tooltip title={getFullDayName(day)} placement="top">
                                            <span>{getDayLabel(day)}</span>
                                        </Tooltip>

                                    </TableCell>

                                ))}

                                <TableCell

                                    align="center"

                                    sx={{

                                        fontWeight: 700,

                                        color: textPrimary,

                                        fontSize: isMobile ? "0.65rem" : "0.75rem",

                                        textTransform: "uppercase",

                                        letterSpacing: 0.5,

                                        bgcolor: isDark ? "#1E293B" : "#F1F5F9",

                                        minWidth: isMobile ? 60 : 100

                                    }}

                                >

                                    {isMobile ? "Tot" : "Total"}

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {data.map((row, rowIndex) => {

                                const total = getDoctorTotal(row);

                                return (

                                    <TableRow

                                        key={row.doctor}

                                        sx={{

                                            "&:hover": {

                                                bgcolor: rowHoverBg

                                            },

                                            transition: "background 0.2s"

                                        }}

                                    >

                                        <TableCell

                                            sx={{

                                                fontWeight: 600,

                                                color: textPrimary,

                                                fontSize: isMobile ? "0.75rem" : "0.875rem",

                                                position: "sticky",

                                                left: 0,

                                                bgcolor: cardBg,

                                                zIndex: 1,

                                                px: isMobile ? 1 : 2,

                                                minWidth: isMobile ? 100 : 180,

                                            }}

                                        >

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: isMobile ? 24 : 28,
                                                        height: isMobile ? 24 : 28,
                                                        bgcolor: ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#D97706"][rowIndex % 5],
                                                        fontSize: isMobile ? 10 : 11,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {row.doctor.charAt(0)}
                                                </Avatar>
                                                {isMobile && row.doctor.length > 10 
                                                    ? row.doctor.substring(0, 10) + "..." 
                                                    : row.doctor}
                                            </Box>

                                        </TableCell>

                                        {displayDays.map((day) => {

                                            const value = row[day];

                                            return (

                                                <TableCell

                                                    key={day}

                                                    align="center"

                                                    sx={{

                                                        background: getColor(value),

                                                        color: getTextColor(value),

                                                        fontWeight: value > 0 ? 700 : 400,

                                                        fontSize: isMobile ? "0.75rem" : "0.875rem",

                                                        borderRadius: 0,

                                                        px: isMobile ? 0.5 : 1,

                                                        minWidth: isMobile ? 60 : 80,

                                                        transition: "all 0.2s",

                                                        "&:hover": {

                                                            transform: "scale(1.05)",

                                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

                                                            zIndex: 3,

                                                            position: "relative"

                                                        }

                                                    }}

                                                >

                                                    <Tooltip

                                                        title={`${row.doctor} - ${getFullDayName(day)}: ${value} interactions`}

                                                        placement="top"

                                                    >

                                                        <span>{value}</span>

                                                    </Tooltip>

                                                </TableCell>

                                            );

                                        })}

                                        <TableCell

                                            align="center"

                                            sx={{

                                                fontWeight: 700,

                                                color: "#2563EB",

                                                fontSize: isMobile ? "0.75rem" : "0.875rem",

                                                bgcolor: isDark ? "#1E293B" : "#F8FAFC",

                                                minWidth: isMobile ? 60 : 100,

                                            }}

                                        >

                                            {total}

                                        </TableCell>

                                    </TableRow>

                                );

                            })}

                        </TableBody>

                    </Table>

                </TableContainer>

                {/* Footer Stats */}
                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: `1px solid ${dividerColor}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: textSecondary, fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                            Most active: <strong style={{ color: textPrimary }}>{data[0]?.doctor}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                            Total: <strong style={{ color: textPrimary }}>{data.reduce((sum, d) => sum + getDoctorTotal(d), 0)}</strong>
                        </Typography>
                        <Chip
                            size="small"
                            label="Live"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: isMobile ? "0.5rem" : "0.625rem" }}
                        />
                    </Box>
                </Box>

            </CardContent>

        </Card>

    );

}

export default DoctorHeatmap;