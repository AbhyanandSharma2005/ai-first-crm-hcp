import { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Skeleton,
    Alert,
    Divider,
    useTheme,
} from "@mui/material";

import {
    Today as TodayIcon,
    CheckCircle as CheckCircleIcon,
    Category as CategoryIcon,
    People as PeopleIcon
} from "@mui/icons-material";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

//-----------------------------------------------------
// DashboardKPICards Component
//-----------------------------------------------------

function DashboardKPICards() {
    const theme = useTheme();
    const { mode } = useCustomTheme();

    //-----------------------------------------------------
    // State
    //-----------------------------------------------------

    const [kpi, setKpi] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    //-----------------------------------------------------
    // Fetch KPI Data
    //-----------------------------------------------------

    const fetchKPI = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get("/dashboard/kpi");

            if (

                response.data.success &&

                response.data.data

            ) {

                setKpi(response.data.data);

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load KPI data."

                );

            }

        }

        catch (err) {

            console.error("KPI fetch error:", err);

            setError(

                err.response?.data?.message ||

                "Unable to load KPI data."

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

        fetchKPI();

    }, []);

    //-----------------------------------------------------
    // Auto Refresh KPI (every 30 seconds)
    //-----------------------------------------------------

    useEffect(() => {

        const interval = setInterval(() => {

            fetchKPI();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    // Get card colors based on theme
    const getCardGradients = () => {
        const isDark = mode === 'dark';
        return {
            today: isDark 
                ? "linear-gradient(135deg, #0D2847 0%, #1A3D6B 100%)"
                : "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
            completed: isDark
                ? "linear-gradient(135deg, #0D2E26 0%, #1A4D3D 100%)"
                : "linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)",
            products: isDark
                ? "linear-gradient(135deg, #2D1A4A 0%, #4A2D6B 100%)"
                : "linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)",
            average: isDark
                ? "linear-gradient(135deg, #3D1A0D 0%, #6B3320 100%)"
                : "linear-gradient(135deg, #E65100 0%, #FFA726 100%)",
        };
    };

    const gradients = getCardGradients();

    //-----------------------------------------------------
    // Loading State
    //-----------------------------------------------------

    if (loading) {

        return (

            <Grid

                container

                spacing={3}

                sx={{ mb: 4 }}

            >

                {[1, 2, 3, 4].map((item) => (

                    <Grid

                        key={item}

                        item

                        xs={12}

                        sm={6}

                        md={3}

                    >

                        <Skeleton

                            variant="rounded"

                            height={170}

                            sx={{ borderRadius: 5 }}

                        />

                    </Grid>

                ))}

            </Grid>

        );

    }

    //-----------------------------------------------------
    // Error State
    //-----------------------------------------------------

    if (error) {

        return (

            <Alert

                severity="error"

                sx={{

                    mb: 4,

                    borderRadius: 3

                }}

            >

                {error}

            </Alert>

        );

    }

    //-----------------------------------------------------
    // Empty State
    //-----------------------------------------------------

    if (!kpi) {

        return (

            <Alert

                severity="info"

                sx={{

                    mb: 4,

                    borderRadius: 3

                }}

            >

                KPI data unavailable.

            </Alert>

        );

    }

    //-----------------------------------------------------
    // KPI Card Configuration
    //-----------------------------------------------------

    const kpiCards = [

        {

            id: "today_followups",

            title: "Today's Followups",

            value: kpi.today_followups,

            icon: <TodayIcon sx={{ fontSize: 40 }} />,

            gradient: gradients.today,

            description: "Follow-ups scheduled for today"

        },

        {

            id: "completed_followups",

            title: "Completed Followups",

            value: kpi.completed_followups,

            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,

            gradient: gradients.completed,

            description: "Follow-ups completed"

        },

        {

            id: "unique_products",

            title: "Unique Products",

            value: kpi.unique_products,

            icon: <CategoryIcon sx={{ fontSize: 40 }} />,

            gradient: gradients.products,

            description: "Distinct products in CRM"

        },

        {

            id: "average_interactions",

            title: "Avg Interactions/HCP",

            value: kpi.average_interactions_per_hcp,

            icon: <PeopleIcon sx={{ fontSize: 40 }} />,

            gradient: gradients.average,

            description: "Average per healthcare professional",

            format: (val) => val.toFixed(1)

        }

    ];

    //-----------------------------------------------------
    // Main UI
    //-----------------------------------------------------

    return (

        <Grid

            container

            spacing={3}

            sx={{ mb: 4 }}

        >

            {kpiCards.map((card) => (

                <Grid

                    key={card.id}

                    item

                    xs={12}

                    sm={6}

                    md={3}

                >

                    <Card

                        sx={{

                            height: "100%",

                            borderRadius: 5,

                            background: card.gradient,

                            color: "#FFFFFF",

                            boxShadow: theme.shadows[6],

                            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",

                            "&:hover": {

                                transform: "translateY(-6px)",

                                boxShadow: theme.shadows[12]

                            },

                            position: "relative",

                            overflow: "hidden"

                        }}

                    >

                        {/* Decorative Background Circle */}

                        <Box

                            sx={{

                                position: "absolute",

                                top: -20,

                                right: -20,

                                width: 120,

                                height: 120,

                                borderRadius: "50%",

                                backgroundColor: "rgba(255,255,255,0.1)",

                                pointerEvents: "none"

                            }}

                        />

                        <CardContent>

                            <Box

                                sx={{

                                    display: "flex",

                                    justifyContent: "space-between",

                                    alignItems: "flex-start",

                                    mb: 2

                                }}

                            >

                                <Typography

                                    variant="subtitle2"

                                    sx={{

                                        opacity: 0.9,

                                        letterSpacing: 1,

                                        fontWeight: 600,

                                        textTransform: "uppercase",

                                        fontSize: "0.75rem"

                                    }}

                                >

                                    {card.title}

                                </Typography>

                                <Box

                                    sx={{

                                        backgroundColor: "rgba(255,255,255,0.2)",

                                        borderRadius: "50%",

                                        p: 1,

                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent: "center"

                                    }}

                                >

                                    {card.icon}

                                </Box>

                            </Box>

                            <Typography

                                variant="h3"

                                fontWeight={700}

                                sx={{

                                    mb: 1,

                                    lineHeight: 1.2

                                }}

                            >

                                {card.format

                                    ? card.format(card.value)

                                    : card.value

                                }

                            </Typography>

                            <Divider

                                sx={{

                                    my: 1.5,

                                    bgcolor: "rgba(255,255,255,0.2)"

                                }}

                            />

                            <Typography

                                variant="body2"

                                sx={{

                                    opacity: 0.9,

                                    fontSize: "0.875rem"

                                }}

                            >

                                {card.description}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}

export default DashboardKPICards;