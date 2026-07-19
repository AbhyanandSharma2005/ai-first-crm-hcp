import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { useState } from "react";

function DashboardFilters({ onApply }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [product, setProduct] = useState("");

    const [hcp, setHcp] = useState("");

    const [month, setMonth] = useState("");

    const handleApply = () => {

        onApply({

            product: product || null,

            hcp: hcp || null,

            month: month || null

        });

    };

    const handleClear = () => {
        setProduct("");
        setHcp("");
        setMonth("");
        
        onApply({
            product: null,
            hcp: null,
            month: null
        });
    };

    return (

        <Box
            sx={{
                mb: 3,
                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                },
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >

            <Grid
                container
                spacing={{
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                }}
                alignItems="center"
            >

                {/* Product Filter */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <TextField
                        label="Product"
                        value={product}
                        onChange={(e) =>
                            setProduct(e.target.value)
                        }
                        size="small"
                        fullWidth
                        placeholder="Filter by product"
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: theme.palette.text.secondary,
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: theme.palette.divider,
                                },
                                "&:hover fieldset": {
                                    borderColor: theme.palette.text.secondary,
                                },
                            },
                        }}
                    />
                </Grid>

                {/* Doctor Filter */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <TextField
                        label="Doctor"
                        value={hcp}
                        onChange={(e) =>
                            setHcp(e.target.value)
                        }
                        size="small"
                        fullWidth
                        placeholder="Filter by doctor"
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: theme.palette.text.secondary,
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: theme.palette.divider,
                                },
                                "&:hover fieldset": {
                                    borderColor: theme.palette.text.secondary,
                                },
                            },
                        }}
                    />
                </Grid>

                {/* Month Filter */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <TextField
                        select
                        label="Month"
                        value={month}
                        onChange={(e) =>
                            setMonth(e.target.value)
                        }
                        size="small"
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: theme.palette.text.secondary,
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: theme.palette.divider,
                                },
                                "&:hover fieldset": {
                                    borderColor: theme.palette.text.secondary,
                                },
                            },
                        }}
                    >

                        <MenuItem value="">
                            All Months
                        </MenuItem>

                        <MenuItem value={1}>January</MenuItem>

                        <MenuItem value={2}>February</MenuItem>

                        <MenuItem value={3}>March</MenuItem>

                        <MenuItem value={4}>April</MenuItem>

                        <MenuItem value={5}>May</MenuItem>

                        <MenuItem value={6}>June</MenuItem>

                        <MenuItem value={7}>July</MenuItem>

                        <MenuItem value={8}>August</MenuItem>

                        <MenuItem value={9}>September</MenuItem>

                        <MenuItem value={10}>October</MenuItem>

                        <MenuItem value={11}>November</MenuItem>

                        <MenuItem value={12}>December</MenuItem>

                    </TextField>
                </Grid>

                {/* Action Buttons */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleApply}
                            fullWidth
                            sx={{
                                flex: 1,
                                py: {
                                    xs: 1,
                                    sm: 0.75,
                                },
                            }}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleClear}
                            fullWidth
                            sx={{
                                flex: 1,
                                py: {
                                    xs: 1,
                                    sm: 0.75,
                                },
                                color: theme.palette.text.secondary,
                                borderColor: theme.palette.divider,
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Grid>

            </Grid>

        </Box>

    );

}

export default DashboardFilters;