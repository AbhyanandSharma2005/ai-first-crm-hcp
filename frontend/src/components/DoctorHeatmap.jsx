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
    Avatar
} from "@mui/material";

import {
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    Whatshot as WhatshotIcon
} from "@mui/icons-material";

import API from "../api/api";

//-----------------------------------------------------
// DoctorHeatmap Component
//-----------------------------------------------------

function DoctorHeatmap() {

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [maxValue, setMaxValue] = useState(0);

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
                setData(heatmapData);

                // Calculate max value for color intensity
                let max = 0;
                heatmapData.forEach(row => {
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

    }, []);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchHeatmap();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    //-----------------------------------------------------
    // Color Helper with Gradient
    //-----------------------------------------------------

    const getColor = (count) => {

        if (count === 0) return "#F1F5F9";

        const intensity = maxValue > 0 ? count / maxValue : 0;

        if (intensity >= 0.8) return "#1E40AF"; // Dark Blue
        if (intensity >= 0.6) return "#2563EB"; // Blue
        if (intensity >= 0.4) return "#60A5FA"; // Light Blue
        if (intensity >= 0.2) return "#93C5FD"; // Lighter Blue
        return "#DBEAFE"; // Lightest Blue

    };

    //-----------------------------------------------------
    // Get Text Color based on background
    //-----------------------------------------------------

    const getTextColor = (count) => {

        if (count === 0) return "#64748B";

        const intensity = maxValue > 0 ? count / maxValue : 0;

        if (intensity >= 0.6) return "#FFFFFF";

        return "#0F172A";

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

                    border: "1px solid #E2E8F0",

                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)"

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
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

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

                    <Divider sx={{ mb: 3 }} />

                    <Skeleton

                        variant="rounded"

                        height={300}

                        sx={{ borderRadius: 2 }}

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

                    border: "1px solid #E2E8F0",

                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)"

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
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

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

                    <Divider sx={{ mb: 3 }} />

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

                    border: "1px solid #E2E8F0",

                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)"

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
                            <CalendarIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

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

                    <Divider sx={{ mb: 3 }} />

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

    return (

        <Card

            sx={{

                height: "100%",

                borderRadius: 4,

                border: "1px solid #E2E8F0",

                background:

                    "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",

                transition: "0.25s",

                "&:hover": {

                    boxShadow: "0 12px 30px rgba(15,23,42,0.15)"

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
                        <WhatshotIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"

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
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Legend */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        flexWrap: "wrap"
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Activity Level:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#F1F5F9", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">0</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#DBEAFE", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">Low</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#93C5FD", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">Medium</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#60A5FA", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">High</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#2563EB", borderRadius: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">Very High</Typography>
                    </Box>
                </Box>

                {/* Heatmap Table */}
                <TableContainer

                    component={Paper}

                    sx={{

                        borderRadius: 2,

                        border: "1px solid #E2E8F0",

                        boxShadow: "none",

                        overflowX: "auto"

                    }}

                >

                    <Table

                        sx={{

                            minWidth: 650,

                            "& .MuiTableCell-root": {

                                borderBottom: "1px solid #E2E8F0",

                                py: 1.5

                            }

                        }}

                    >

                        <TableHead>

                            <TableRow

                                sx={{

                                    bgcolor: "#F8FAFC"

                                }}

                            >

                                <TableCell

                                    sx={{

                                        fontWeight: 700,

                                        color: "#0F172A",

                                        fontSize: "0.875rem",

                                        width: 180,

                                        position: "sticky",

                                        left: 0,

                                        bgcolor: "#F8FAFC",

                                        zIndex: 2

                                    }}

                                >

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PersonIcon sx={{ fontSize: 16, color: "#64748B" }} />
                                        Doctor
                                    </Box>

                                </TableCell>

                                {days.map((day, index) => (

                                    <TableCell

                                        key={day}

                                        align="center"

                                        sx={{

                                            fontWeight: 600,

                                            color: "#0F172A",

                                            fontSize: "0.75rem",

                                            textTransform: "uppercase",

                                            letterSpacing: 0.5,

                                            minWidth: 80

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

                                        color: "#0F172A",

                                        fontSize: "0.75rem",

                                        textTransform: "uppercase",

                                        letterSpacing: 0.5,

                                        bgcolor: "#F1F5F9",

                                        minWidth: 100

                                    }}

                                >

                                    Total

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

                                                bgcolor: "#F8FAFC"

                                            },

                                            transition: "background 0.2s"

                                        }}

                                    >

                                        <TableCell

                                            sx={{

                                                fontWeight: 600,

                                                color: "#0F172A",

                                                fontSize: "0.875rem",

                                                position: "sticky",

                                                left: 0,

                                                bgcolor: "#FFFFFF",

                                                zIndex: 1

                                            }}

                                        >

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        bgcolor: ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#D97706"][rowIndex % 5],
                                                        fontSize: 11,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {row.doctor.charAt(0)}
                                                </Avatar>
                                                {row.doctor}
                                            </Box>

                                        </TableCell>

                                        {days.map((day) => {

                                            const value = row[day];

                                            return (

                                                <TableCell

                                                    key={day}

                                                    align="center"

                                                    sx={{

                                                        background: getColor(value),

                                                        color: getTextColor(value),

                                                        fontWeight: value > 0 ? 700 : 400,

                                                        fontSize: "0.875rem",

                                                        borderRadius: 0,

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

                                                fontSize: "0.875rem",

                                                bgcolor: "#F8FAFC"

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
                        borderTop: "1px solid #E2E8F0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: "#94A3B8", fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            Most active doctor: <strong>{data[0]?.doctor}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Total interactions: <strong>{data.reduce((sum, d) => sum + getDoctorTotal(d), 0)}</strong>
                        </Typography>
                        <Chip
                            size="small"
                            label="Updated in real-time"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: "0.625rem" }}
                        />
                    </Box>
                </Box>

            </CardContent>

        </Card>

    );

}

export default DoctorHeatmap;