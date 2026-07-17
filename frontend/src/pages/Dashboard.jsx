import React, { useState, useEffect } from "react";

import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import API from "../api/api";

import SearchHCP from "../components/SearchHCP";
import Metrics from "../components/Metrics";
import DashboardAnalytics from "../components/DashboardAnalytics";

function Dashboard() {

    const [metrics, setMetrics] = useState(null);

    const [dashboardStats, setDashboardStats] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchMetrics();

    }, []);

    const fetchMetrics = async () => {

        try {

            const response = await API.get("/metrics");

            console.log("Metrics:", response.data);

            if (

                response.data.success &&

                response.data.data

            ) {

                setMetrics(response.data.data);

            }

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 10
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    const cards = [

        {

            title: "Total HCPs",

            value:

                dashboardStats?.total_hcps ??

                metrics?.total_hcps ??

                "-",

            icon: <PeopleAltIcon fontSize="large" />,

            description: "Healthcare Professionals"

        },

        {

            title: "Interactions Logged",

            value:

                dashboardStats?.total_interactions ??

                metrics?.total_interactions ??

                "-",

            icon: <EventNoteIcon fontSize="large" />,

            description: "Total interactions recorded"

        },

        {

            title: "Application",

            value:

                metrics?.status ??

                "-",

            icon: <SmartToyIcon fontSize="large" />,

            description:

                metrics?.api ??

                "AI CRM"

        },

        {

            title: "Environment",

            value:

                metrics?.environment ??

                "-",

            icon: <TrendingUpIcon fontSize="large" />,

            description:

                `Version ${metrics?.version ?? "-"}`

        }

    ];

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="600"
                gutterBottom
            >

                Dashboard

            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
            >

                Welcome to the AI-First CRM Healthcare Professional Module.

                Manage HCP interactions efficiently using AI-powered assistance.

            </Typography>

            <Grid
                container
                spacing={3}
            >

                {

                    cards.map((card, index) => (

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={3}

                            key={index}

                        >

                            <Card

                                sx={{

                                    height: "100%",

                                    borderRadius: 3,

                                    boxShadow: 3

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

                                            color="text.secondary"

                                        >

                                            {card.title}

                                        </Typography>

                                        {card.icon}

                                    </Box>

                                    <Typography

                                        variant="h3"

                                        fontWeight="bold"

                                    >

                                        {card.value}

                                    </Typography>

                                    <Typography

                                        variant="body2"

                                        color="text.secondary"

                                        sx={{ mt: 1 }}

                                    >

                                        {card.description}

                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))

                }

            </Grid>

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
                        fontWeight="600"
                        gutterBottom
                    >

                        AI CRM Assistant

                    </Typography>

                    <Typography color="text.secondary">

                        Use the AI assistant to summarize HCP meetings,

                        extract key insights,

                        recommend next actions,

                        search Healthcare Professionals,

                        and maintain accurate interaction records.

                    </Typography>

                </CardContent>

            </Card>

            <Box sx={{ mt: 4 }}>

                <DashboardAnalytics

                    onDataLoaded={setDashboardStats}

                />

            </Box>

            <Box sx={{ mt: 4 }}>

                <SearchHCP />

            </Box>

            <Box sx={{ mt: 4 }}>

                <Metrics />

            </Box>

        </Box>

    );

}

export default Dashboard;