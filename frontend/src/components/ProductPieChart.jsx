import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import { PieChart } from "@mui/x-charts/PieChart";

function ProductPieChart({ products }) {

    if (!products || Object.keys(products).length === 0) {

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
                        variant="h6"
                        gutterBottom
                    >

                        Product Distribution

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        No product data available.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    const pieData = Object.entries(products).map(

        ([product, count], index) => ({

            id: index,

            value: count,

            label: product

        })

    );

    const totalProducts = pieData.reduce(

        (sum, item) => sum + item.value,

        0

    );

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
                    fontWeight="600"
                    gutterBottom
                >

                    Product Distribution

                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 4,
                        mt: 2
                    }}
                >

                    <PieChart

                        width={450}

                        height={300}

                        series={[

                            {

                                data: pieData,

                                innerRadius: 45,

                                outerRadius: 110,

                                paddingAngle: 2,

                                cornerRadius: 5,

                                highlightScope: {

                                    faded: "global",

                                    highlighted: "item"

                                },

                                faded: {

                                    innerRadius: 35,

                                    additionalRadius: -8,

                                    color: "gray"

                                }

                            }

                        ]}

                    />

                    <Box>

                        <Typography
                            variant="h6"
                            gutterBottom
                        >

                            Product Summary

                        </Typography>

                        {

                            pieData.map((item) => (

                                <Box
                                    key={item.id}
                                    sx={{
                                        mb: 1
                                    }}
                                >

                                    <Typography>

                                        <strong>

                                            {item.label}

                                        </strong>

                                        {" : "}

                                        {item.value}

                                        {" Interaction"}

                                        {item.value > 1 ? "s" : ""}

                                        {" ("}

                                        {

                                            (

                                                (item.value / totalProducts) *

                                                100

                                            ).toFixed(1)

                                        }

                                        {"%)"}

                                    </Typography>

                                </Box>

                            ))

                        }

                        <Typography
                            sx={{
                                mt: 2,
                                fontWeight: "bold"
                            }}
                        >

                            Total Interactions : {totalProducts}

                        </Typography>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}

export default ProductPieChart;