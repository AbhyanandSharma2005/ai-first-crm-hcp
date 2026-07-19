import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

function InteractionTrend() {
    const theme = useTheme();
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chartData, setChartData] = useState([]);

    // Responsive chart height
    const chartHeight = isMobile ? 280 : isTablet ? 320 : 380;

    // Theme colors
    const cardBg = isDark ? "#1E293B" : "#FFFFFF";
    const borderColor = isDark ? "#334155" : "#E2E8F0";
    const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
    const gridColor = isDark ? "#334155" : "#E2E8F0";
    const axisColor = isDark ? "#94A3B8" : "#64748B";

    const fetchTrend = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(
                "/dashboard/monthly"
            );

            console.log(
                "Monthly Trend:",
                response.data
            );

            if (

                response.data.success &&

                response.data.data

            ) {

                setChartData(

                    response.data.data.monthly_data

                );

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load interaction trend."

                );

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Failed to fetch monthly trend."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchTrend();

        const interval = setInterval(() => {

            fetchTrend();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return (

            <Card
                sx={{
                    mt: 4,
                    borderRadius: 3,
                    border: `1px solid ${borderColor}`,
                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
                    backgroundColor: cardBg,
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 3
                        }}
                    >

                        <CircularProgress />

                    </Box>

                </CardContent>

            </Card>

        );

    }

    if (error) {

        return (

            <Card
                sx={{
                    mt: 4,
                    borderRadius: 3,
                    border: `1px solid ${borderColor}`,
                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
                    backgroundColor: cardBg,
                }}
            >

                <CardContent>

                    <Typography
                        color="error"
                        gutterBottom
                    >

                        {error}

                    </Typography>

                    <Button

                        variant="contained"

                        onClick={fetchTrend}

                    >

                        Retry

                    </Button>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card
            sx={{
                mt: 4,
                borderRadius: 3,
                border: `1px solid ${borderColor}`,
                background: isDark
                    ? "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)"
                    : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)',
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    color={textPrimary}
                    gutterBottom
                >

                    Monthly Interaction Trend

                </Typography>

                {

                    chartData.length === 0 ?

                    (

                        <Typography
                            color="text.secondary"
                            sx={{ py: 3, textAlign: "center" }}
                        >

                            No interaction data available.

                        </Typography>

                    )

                    :

                    (

                        <ResponsiveContainer

                            width="100%"

                            height={chartHeight}

                        >

                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 10,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={gridColor}
                                />

                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: isMobile ? 10 : 12, fill: axisColor }}
                                    interval={isMobile ? 1 : 0}
                                    stroke={axisColor}
                                />

                                <YAxis
                                    tick={{ fontSize: isMobile ? 10 : 12, fill: axisColor }}
                                    stroke={axisColor}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: `1px solid ${borderColor}`,
                                        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                                        backgroundColor: cardBg,
                                        color: textPrimary,
                                    }}
                                    labelStyle={{
                                        color: textPrimary,
                                    }}
                                />

                                <Legend
                                    wrapperStyle={{
                                        fontSize: isMobile ? 10 : 12,
                                        color: textPrimary,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Interactions"
                                    stroke="#1976d2"
                                    strokeWidth={isMobile ? 2 : 3}
                                    activeDot={{ r: isMobile ? 6 : 8 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    )

                }

            </CardContent>

        </Card>

    );

}

export default InteractionTrend;