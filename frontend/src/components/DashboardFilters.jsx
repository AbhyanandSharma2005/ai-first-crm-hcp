import {
    Box,
    Button,
    MenuItem,
    TextField
} from "@mui/material";

import { useState } from "react";

function DashboardFilters({ onApply }) {

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

    return (

        <Box
            sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap"
            }}
        >

            <TextField
                label="Product"
                value={product}
                onChange={(e) =>
                    setProduct(e.target.value)
                }
                size="small"
            />

            <TextField
                label="Doctor"
                value={hcp}
                onChange={(e) =>
                    setHcp(e.target.value)
                }
                size="small"
            />

            <TextField
                select
                label="Month"
                value={month}
                onChange={(e) =>
                    setMonth(e.target.value)
                }
                size="small"
                sx={{ width: 180 }}
            >

                <MenuItem value="">
                    All
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

            <Button

                variant="contained"

                onClick={handleApply}

            >

                Apply Filters

            </Button>

        </Box>

    );

}

export default DashboardFilters;