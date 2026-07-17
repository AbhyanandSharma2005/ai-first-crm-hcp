import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Button
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

function InteractionTrend() {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [chartData, setChartData] = useState([]);

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

    }, []);

    if (loading) {

        return (

            <Card
                sx={{
                    mt: 4,
                    borderRadius: 3
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
                    borderRadius: 3
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
                boxShadow: 3
            }}
        >

            <CardContent>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                >

                    Monthly Interaction Trend

                </Typography>

                {

                    chartData.length === 0 ?

                    (

                        <Typography
                            color="text.secondary"
                        >

                            No interaction data available.

                        </Typography>

                    )

                    :

                    (

                        <ResponsiveContainer

                            width="100%"

                            height={350}

                        >

                            <LineChart
                                data={chartData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="month"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Interactions"
                                    stroke="#1976d2"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
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