import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    Alert,
    Chip,
    Divider
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from "recharts";

import API from "../api/api";

//-----------------------------------------------------
// TopDoctorsChart Component
//-----------------------------------------------------

function TopDoctorsChart() {

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

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

                setData(response.data.data.doctors);

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

    }, []);

    //-----------------------------------------------------
    // Auto Refresh (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchDoctors();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    //-----------------------------------------------------
    // Colors for bars (gradient effect)
    //-----------------------------------------------------

    const colors = [
        "#1976D2",
        "#2196F3",
        "#42A5F5",
        "#64B5F6",
        "#90CAF9",
        "#1565C0",
        "#0D47A1",
        "#1E88E5",
        "#4FC3F7",
        "#29B6F6"
    ];

    //-----------------------------------------------------
    // Custom Tooltip
    //-----------------------------------------------------

    const CustomTooltip = ({ active, payload, label }) => {

        if (active && payload && payload.length) {

            return (

                <Box

                    sx={{

                        bgcolor: "white",

                        p: 2,

                        borderRadius: 2,

                        boxShadow: 3,

                        border: "1px solid #E2E8F0"

                    }}

                >

                    <Typography

                        variant="subtitle2"

                        fontWeight={700}

                        color="primary"

                    >

                        {label}

                    </Typography>

                    <Typography

                        variant="body2"

                        color="text.secondary"

                    >

                        Interactions: <strong>{payload[0].value}</strong>

                    </Typography>

                </Box>

            );

        }

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

                    <Skeleton

                        variant="rounded"

                        height={280}

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

                        label={`${data.length} Doctors`}

                        color="primary"

                        variant="outlined"

                    />

                </Box>

                <Divider sx={{ mb: 3 }} />

                <ResponsiveContainer

                    width="100%"

                    height={350}

                >

                    <BarChart

                        data={data}

                        layout="vertical"

                        margin={{

                            top: 10,

                            right: 30,

                            left: 40,

                            bottom: 10

                        }}

                    >

                        <CartesianGrid

                            strokeDasharray="3 3"

                            horizontal={false}

                        />

                        <XAxis

                            type="number"

                            tick={{ fontSize: 12 }}

                        />

                        <YAxis

                            type="category"

                            dataKey="doctor"

                            tick={{ fontSize: 12 }}

                            width={100}

                        />

                        <Tooltip

                            content={<CustomTooltip />}

                            cursor={{ fill: "rgba(25, 118, 210, 0.1)" }}

                        />

                        <Bar

                            dataKey="interactions"

                            fill="#1976d2"

                            radius={[0, 4, 4, 0]}

                            barSize={20}

                            label={{

                                position: "right",

                                fontSize: 12,

                                fill: "#4A5568",

                                fontWeight: 600

                            }}

                        >

                            {data.map((entry, index) => (

                                <Cell

                                    key={`cell-${index}`}

                                    fill={colors[index % colors.length]}

                                />

                            ))}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

}

export default TopDoctorsChart;