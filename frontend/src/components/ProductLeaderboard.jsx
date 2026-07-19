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
    LinearProgress,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {
    EmojiEvents as TrophyIcon,
    LocalOffer as ProductIcon,
    TrendingUp as TrendingUpIcon
} from "@mui/icons-material";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

//-----------------------------------------------------
// ProductLeaderboard Component
//-----------------------------------------------------

function ProductLeaderboard() {
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

    // Responsive settings
    const barHeight = isMobile ? 20 : isTablet ? 24 : 28;
    const maxDisplayItems = isMobile ? 5 : 10;
    const itemSpacing = isMobile ? 2 : isTablet ? 2.5 : 3.5;
    const avatarSize = isMobile ? 20 : isTablet ? 24 : 28;
    const avatarFontSize = isMobile ? 9 : isTablet ? 10 : 12;
    const productNameSize = isMobile ? "0.7rem" : isTablet ? "0.8rem" : "0.875rem";
    const interactionCountSize = isMobile ? "0.7rem" : isTablet ? "0.8rem" : "0.875rem";
    const percentageLabelSize = isMobile ? "0.5rem" : isTablet ? "0.55rem" : "0.65rem";
    const medalSize = isMobile ? 14 : isTablet ? 16 : 20;

    // Theme colors
    const cardBg = isDark ? "#1E293B" : "#FFFFFF";
    const borderColor = isDark ? "#334155" : "#E2E8F0";
    const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
    const textSecondary = isDark ? "#94A3B8" : "#475569";
    const dividerColor = isDark ? "#334155" : "#E2E8F0";
    const barBgColor = isDark ? "#334155" : "#F1F5F9";

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
                // Limit items on mobile for better display
                const displayData = isMobile ? leaderboardData.slice(0, 5) : leaderboardData;
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

    }, [isMobile]);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchLeaderboard();

        }, 30000);

        return () => clearInterval(interval);

    }, [isMobile]);

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
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

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

                    <Divider sx={{ mb: 3, borderColor: dividerColor }} />

                    {[1, 2, 3, 4, 5].map((item) => (
                        <Box key={item} sx={{ mb: itemSpacing }}>
                            <Skeleton
                                variant="text"
                                width={isMobile ? "40%" : "30%"}
                                height={isMobile ? 18 : 24}
                                sx={{ bgcolor: isDark ? '#334155' : undefined }}
                            />
                            <Skeleton
                                variant="rounded"
                                height={barHeight}
                                sx={{ mt: 0.5, bgcolor: isDark ? '#334155' : undefined }}
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
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

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
                            <TrophyIcon sx={{ color: "#2563EB", fontSize: isMobile ? 24 : 28 }} />
                            <Typography

                                variant="h6"

                                fontWeight={700}

                                color={textPrimary}
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.25rem"
                                }}

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

                    <Divider sx={{ mb: 3, borderColor: dividerColor }} />

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

                            color={textPrimary}
                            sx={{
                                fontSize: isMobile ? "1rem" : "1.25rem"
                            }}

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
                            sx={{ fontWeight: 600, display: isMobile ? "none" : "inline-flex" }}
                        />
                    </Box>

                </Box>

                <Divider sx={{ mb: 3, borderColor: dividerColor }} />

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
                                    mb: itemSpacing,
                                    "&:last-child": { mb: 0 }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: isMobile ? 0.25 : 0.5
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.75 : 1.5 }}>
                                        {medal && (
                                            <Typography sx={{ fontSize: medalSize }}>
                                                {medal}
                                            </Typography>
                                        )}
                                        <Avatar
                                            sx={{
                                                width: avatarSize,
                                                height: avatarSize,
                                                bgcolor: productColor,
                                                fontSize: avatarFontSize,
                                                fontWeight: 700,
                                                color: "white"
                                            }}
                                        >
                                            {product.product.charAt(0)}
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            color={textPrimary}
                                            sx={{
                                                fontSize: productNameSize,
                                                letterSpacing: 0.3
                                            }}
                                        >
                                            {isMobile && product.product.length > 12 
                                                ? product.product.substring(0, 12) + "..." 
                                                : product.product}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 2 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="#2563EB"
                                            sx={{ fontSize: interactionCountSize }}
                                        >
                                            {product.interactions}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: barHeight,
                                        backgroundColor: barBgColor,
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
                                                    fontSize: percentageLabelSize,
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
                        mt: isMobile ? 2 : 3,
                        pt: isMobile ? 1.5 : 2,
                        borderTop: `1px solid ${dividerColor}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ProductIcon sx={{ color: textSecondary, fontSize: isMobile ? 14 : 16 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                            Top: <strong style={{ color: textPrimary }}>{data[0]?.product}</strong>
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.6rem" : "0.75rem" }}>
                        Total: <strong style={{ color: textPrimary }}>{data.reduce((sum, d) => sum + d.interactions, 0)}</strong>
                    </Typography>
                </Box>

            </CardContent>

        </Card>

    );

}

export default ProductLeaderboard;