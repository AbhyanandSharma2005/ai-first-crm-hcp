import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Alert,
    Chip,
    Divider,
    Avatar,
    LinearProgress
} from "@mui/material";

import {
    EmojiEvents as TrophyIcon,
    LocalOffer as ProductIcon,
    TrendingUp as TrendingUpIcon
} from "@mui/icons-material";

import API from "../api/api";

//-----------------------------------------------------
// ProductLeaderboard Component
//-----------------------------------------------------

function ProductLeaderboard() {

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [maxValue, setMaxValue] = useState(0);

    //-----------------------------------------------------
    // Fetch Product Leaderboard
    //-----------------------------------------------------

    const fetchLeaderboard = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(

                "/dashboard/product-leaderboard"

            );

            if (

                response.data.success &&

                response.data.data &&

                response.data.data.leaderboard

            ) {

                const leaderboardData = response.data.data.leaderboard;
                setData(leaderboardData);
                
                // Calculate max value for progress bars
                if (leaderboardData.length > 0) {
                    const max = Math.max(...leaderboardData.map(d => d.interactions));
                    setMaxValue(max);
                }

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load product leaderboard."

                );

            }

        }

        catch (err) {

            console.error("Product leaderboard fetch error:", err);

            setError(

                err.response?.data?.message ||

                "Unable to load product leaderboard."

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

        fetchLeaderboard();

    }, []);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchLeaderboard();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    //-----------------------------------------------------
    // Get Gradient Color based on index
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
    // Get Color based on index
    //-----------------------------------------------------

    const getBarColor = (index) => {
        const colors = [
            "#2563EB",
            "#7C3AED",
            "#059669",
            "#DC2626",
            "#D97706",
            "#0891B2",
            "#4F46E5",
            "#DB2777",
            "#65A30D",
            "#9333EA"
        ];
        return colors[index % colors.length];
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
    // Get Product Icon Color
    //-----------------------------------------------------

    const getProductColor = (index) => {
        const colors = [
            "#2563EB",
            "#7C3AED",
            "#059669",
            "#DC2626",
            "#D97706",
            "#0891B2",
            "#4F46E5",
            "#DB2777",
            "#65A30D",
            "#9333EA"
        ];
        return colors[index % colors.length];
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
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

                            >

                                Product Leaderboard

                            </Typography>
                        </Box>

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
                                height={32}
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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

                            >

                                Product Leaderboard

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
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color="#0F172A"

                            >

                                Product Leaderboard

                            </Typography>
                        </Box>

                        <Chip

                            size="small"

                            label="0 Products"

                            color="default"

                        />

                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Alert

                        severity="info"

                        sx={{ borderRadius: 2 }}

                    >

                        No product data available.

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

                        mb: 2

                    }}

                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <TrophyIcon sx={{ color: "#2563EB", fontSize: 28 }} />
                        <Typography

                            variant="h6"

                            fontWeight={700}

                            color="#0F172A"

                        >

                            Product Leaderboard

                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip

                            size="small"

                            label={`${data.length} Products`}

                            color="primary"

                            variant="outlined"

                        />
                        <Chip
                            size="small"
                            icon={<TrendingUpIcon />}
                            label="Top Products"
                            color="success"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mt: 2 }}>
                    {data.map((product, index) => {
                        const percentage = maxValue > 0 
                            ? (product.interactions / maxValue) * 100 
                            : 0;
                        const medal = getMedal(index);
                        const color = getBarColor(index);
                        const gradient = getGradientColor(index);
                        const productColor = getProductColor(index);

                        return (
                            <Box
                                key={index}
                                sx={{
                                    mb: 3.5,
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
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        {medal && (
                                            <Typography sx={{ fontSize: 20 }}>
                                                {medal}
                                            </Typography>
                                        )}
                                        <Avatar
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                bgcolor: productColor,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "white"
                                            }}
                                        >
                                            {product.product.charAt(0)}
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            color="#0F172A"
                                            sx={{
                                                fontSize: "0.875rem",
                                                letterSpacing: 0.3
                                            }}
                                        >
                                            {product.product}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="#2563EB"
                                            sx={{ fontSize: "0.875rem" }}
                                        >
                                            {product.interactions} interactions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: 28,
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
                                                    fontSize: "0.65rem",
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
                        alignItems: "center"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ProductIcon sx={{ color: "#94A3B8", fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            Top product: <strong>{data[0]?.product}</strong>
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Total interactions: <strong>{data.reduce((sum, d) => sum + d.interactions, 0)}</strong>
                    </Typography>
                </Box>

            </CardContent>

        </Card>

    );

}

export default ProductLeaderboard;