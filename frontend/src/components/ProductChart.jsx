import {

    ResponsiveContainer,

    BarChart,

    Bar,

    XAxis,

    YAxis,

    Tooltip,

    CartesianGrid,

    PieChart,

    Pie,

    Cell,

    Legend

} from "recharts";

import {

    Grid,

    Paper,

    Typography

} from "@mui/material";

const COLORS = [

    "#1976d2",

    "#2e7d32",

    "#ed6c02",

    "#9c27b0",

    "#d32f2f",

    "#0288d1"

];

function ProductChart({

    products

}) {

    if (!products) {

        return null;

    }

    const data = Object.entries(products).map(

        ([name, value]) => ({

            name,

            value

        })

    );

    return (

        <Grid

            container

            spacing={3}

            sx={{

                mt: 2

            }}

        >

            <Grid

                item

                xs={12}

                md={6}

            >

                <Paper

                    sx={{

                        p:3

                    }}

                >

                    <Typography

                        variant="h6"

                        gutterBottom

                    >

                        Product Distribution

                    </Typography>

                    <ResponsiveContainer

                        width="100%"

                        height={320}

                    >

                        <BarChart

                            data={data}

                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="name"/>

                            <YAxis/>

                            <Tooltip/>

                            <Bar

                                dataKey="value"

                                fill="#1976d2"

                            />

                        </BarChart>

                    </ResponsiveContainer>

                </Paper>

            </Grid>

            <Grid

                item

                xs={12}

                md={6}

            >

                <Paper

                    sx={{

                        p:3

                    }}

                >

                    <Typography

                        variant="h6"

                        gutterBottom

                    >

                        Product Share

                    </Typography>

                    <ResponsiveContainer

                        width="100%"

                        height={320}

                    >

                        <PieChart>

                            <Pie

                                data={data}

                                dataKey="value"

                                nameKey="name"

                                outerRadius={110}

                                label

                            >

                                {

                                    data.map(

                                        (

                                            entry,

                                            index

                                        ) => (

                                            <Cell

                                                key={index}

                                                fill={

                                                    COLORS[

                                                        index %

                                                        COLORS.length

                                                    ]

                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Legend/>

                            <Tooltip/>

                        </PieChart>

                    </ResponsiveContainer>

                </Paper>

            </Grid>

        </Grid>

    );

}

export default ProductChart;