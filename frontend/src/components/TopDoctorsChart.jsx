import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    Alert,
    Chip,
    Divider,
    Avatar,
    LinearProgress,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {
    Person as PersonIcon,
    EmojiEvents as TrophyIcon,
    TrendingUp as TrendingUpIcon
} from "@mui/icons-material";

import API from "../api/api";

//-----------------------------------------------------
// TopDoctorsChart Component
//-----------------------------------------------------

function TopDoctorsChart() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [maxValue, setMaxValue] = useState(0);

    // Responsive bar height
    const barHeight = isMobile ? 24 : 28;
    const maxDisplayItems = isMobile ? 5 : 10;

    //-----------------------------------------------------
    // Fetch Top Doctors
    //-----------------------------------------------------

    const fetchDoctors = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get("/dashboard/top-doctors");

            if (

                response.data.success &&

                response.data.data &&

                response.data.data.doctors

            ) {

                const doctorsData = response.data.data.doctors;
                // Limit items on mobile for better display
                const displayData = isMobile ? doctorsData.slice(0, 5) : doctorsData;
                setData(displayData);
                
                // Calculate max value for progress bars
                if (displayData.length > 0) {
                    const max = Math.max(...displayData.map(d => d.interactions));
                    setMaxValue(max);
                }

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load top doctors."

                );

            }

        }

        catch (err) {

            console.error("Top doctors fetch error:", err);

            setError(

                err.response?.data?.message ||

                "Unable to load top doctors."

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

        fetchDoctors();

    }, [isMobile]);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchDoctors();

        }, 30000);

        return () => clearInterval(interval);

    }, [isMobile]);

    //-----------------------------------------------------
    // Get Color based on index
    //-----------------------------------------------------

    const getBarColor = (index) => {
        const colors = [
            "#2563EB", // Blue
            "#7C3AED", // Purple
            "#059669", // Emerald
            "#DC2626", // Red
            "#D97706", // Amber
            "#0891B2", // Cyan
            "#4F46E5", // Indigo
            "#DB2777", // Pink
            "#65A30D", // Lime
            "#9333EA"  // Violet
        ];
        return colors[index % colors.length];
    };

    //-----------------------------------------------------
    // Get Gradient Color
    //-----------------------------------------------------

    const getGradientColor = (index) => {
        const gradients = [
            "linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)",
            "linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)",
            "linear-gradient(90deg, #059669 0%, #34D399 100%)",
            "linear-gradient(90deg, #DC2626 0%, #F87171 100%)",
            "linear-gradient(90deg, #D97706 0%, #FBBF24 100%)",
            "linear-gradient(90deg, #0891B2 0%, #67E8F9 100%)",
            "linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)",
            "linear-gradient(90deg, #DB2777 0%, #F472B6 100%)",
            "linear-gradient(90deg, #65A30D 0%, #A3E635 100%)",
            "linear-gradient(90deg, #9333EA 0%, #C084FC 100%)"
        ];
        return gradients[index % gradients.length];
    };

    //-----------------------------------------------------
    // Get Medal Emoji
    //-----------------------------------------------------

    const getMedal = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return null;
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

                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"

                        >

                            Top Doctors

                        </Typography>

                        <Chip

                            size="small"

                            label="Loading..."

                            color="default"

                        />

                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {[1, 2, 3, 4, 5].map((item) => (
                        <Box key={item} sx={{ mb: 3 }}>
                            <Skeleton
                                variant="text"
                                width="30%"
                                height={24}
                            />
                            <Skeleton
                                variant="rounded"
                                height={barHeight}
                                sx={{ mt: 0.5 }}
                            />
                        </Box>
                    ))}

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

                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"

                        >

                            Top Doctors

                        </Typography>

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

                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"

                        >

                            Top Doctors

                        </Typography>

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

                        No doctor data available.

                    </Alert>

                </CardContent>

            </Card>

        );

    }

    //-----------------------------------------------------
    // Main UI
    //-----------------------------------------------------

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
                        <TrophyIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"
                            sx={{
                                fontSize: isMobile ? "1rem" : "1.25rem"
                            }}

                        >

                            Top Doctors

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
                            label="Leaderboard"
                            color="success"
                            variant="filled"
                            sx={{ fontWeight: 600, display: isMobile ? "none" : "inline-flex" }}
                        />
                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mt: 2 }}>
                    {data.map((doctor, index) => {
                        const percentage = maxValue > 0 
                            ? (doctor.interactions / maxValue) * 100 
                            : 0;
                        const medal = getMedal(index);
                        const color = getBarColor(index);
                        const gradient = getGradientColor(index);

                        return (
                            <Box
                                key={index}
                                sx={{
                                    mb: isMobile ? 2.5 : 3.5,
                                    "&:last-child": { mb: 0 }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 0.5
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 1.5 }}>
                                        {medal && (
                                            <Typography sx={{ fontSize: isMobile ? 16 : 20 }}>
                                                {medal}
                                            </Typography>
                                        )}
                                        <Avatar
                                            sx={{
                                                width: isMobile ? 24 : 28,
                                                height: isMobile ? 24 : 28,
                                                bgcolor: color,
                                                fontSize: isMobile ? 10 : 12,
                                                fontWeight: 700
                                            }}
                                        >
                                            {doctor.doctor.charAt(0)}
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            color="#0F172A"
                                            sx={{
                                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                                                letterSpacing: 0.3
                                            }}
                                        >
                                            {isMobile && doctor.doctor.length > 15 
                                                ? doctor.doctor.substring(0, 15) + "..." 
                                                : doctor.doctor}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 2 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="#2563EB"
                                            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                                        >
                                            {doctor.interactions}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: barHeight,
                                        backgroundColor: "#F1F5F9",
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        position: "relative",
                                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "100%",
                                            width: `${Math.max(percentage, 2)}%`,
                                            background: gradient,
                                            borderRadius: 8,
                                            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            pr: percentage > 15 ? 1.5 : 0,
                                            position: "relative",
                                            "&::after": percentage > 15 ? {
                                                content: '""',
                                                position: "absolute",
                                                right: 0,
                                                top: 0,
                                                height: "100%",
                                                width: 20,
                                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))",
                                                borderRadius: "0 8px 8px 0"
                                            } : {}
                                        }}
                                    >
                                        {percentage > 15 && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "white",
                                                    fontWeight: 700,
                                                    fontSize: isMobile ? "0.55rem" : "0.65rem",
                                                    letterSpacing: 0.5,
                                                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                                                }}
                                            >
                                                {Math.round(percentage)}%
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

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
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                            Top performer: <strong>{data[0]?.doctor}</strong>
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                        Total: <strong>{data.reduce((sum, d) => sum + d.interactions, 0)}</strong>
                    </Typography>
                </Box>

            </CardContent>

        </Card>

    );

}

export default TopDoctorsChart;