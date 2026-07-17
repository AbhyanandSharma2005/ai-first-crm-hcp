import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Box
} from "@mui/material";

import API from "../api/api";

import ProductPieChart from "./ProductPieChart";
import InteractionTrend from "./InteractionTrend";
import RecentInteractionsTable from "./RecentInteractionsTable";

function DashboardAnalytics({ onDataLoaded }) {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [stats, setStats] = useState(null);

    const fetchDashboardStats = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(
                "/dashboard/stats"
            );

            console.log(
                "Dashboard Stats:",
                response.data
            );

            if (
                response.data.success &&
                response.data.data
            ) {

                setStats(
                    response.data.data
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
                    "Unable to load dashboard analytics."
                );

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Failed to fetch dashboard analytics."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchDashboardStats();

    }, []);

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    if (error) {

        return (

            <Box
                sx={{
                    mt: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    color="error"
                    gutterBottom
                >

                    {error}

                </Typography>

                <Button

                    variant="contained"

                    onClick={fetchDashboardStats}

                >

                    Retry

                </Button>

            </Box>

        );

    }

    if (!stats) {

        return null;

    }

    return (

        <Box sx={{ mt: 4 }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >

                    Dashboard Analytics

                </Typography>

                <Button

                    variant="contained"

                    onClick={fetchDashboardStats}

                >

                    Refresh

                </Button>

            </Box>

            <Card
                sx={{
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >

                        Overview

                    </Typography>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <tbody>

                            <tr>

                                <td style={tableHeader}>

                                    Total HCPs

                                </td>

                                <td style={tableCell}>

                                    {stats.total_hcps}

                                </td>

                            </tr>

                            <tr>

                                <td style={tableHeader}>

                                    Total Interactions

                                </td>

                                <td style={tableCell}>

                                    {stats.total_interactions}

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </CardContent>

            </Card>

            <ProductPieChart

                products={stats.products}

            />

            <InteractionTrend />

            <RecentInteractionsTable

                interactions={stats.recent_interactions}

            />

        </Box>

    );

}

const tableHeader = {

    border: "1px solid #ddd",

    padding: "12px",

    backgroundColor: "#1976d2",

    color: "white",

    fontWeight: "bold",

    width: "250px"

};

const tableCell = {

    border: "1px solid #ddd",

    padding: "12px"

};

export default DashboardAnalytics;