import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

function DashboardToolbar({

    search,

    setSearch,

    product,

    setProduct,

    products,

    onRefresh,

    onExport

}) {

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

                label="Search Doctor"

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                size="small"

            />

            <Select

                value={product}

                onChange={(e)=>setProduct(e.target.value)}

                size="small"

                sx={{minWidth:180}}

            >

                <MenuItem value="">

                    All Products

                </MenuItem>

                {

                    products.map(product=>(

                        <MenuItem

                            key={product}

                            value={product}

                        >

                            {product}

                        </MenuItem>

                    ))

                }

            </Select>

            <Button

                variant="contained"

                startIcon={<RefreshIcon/>}

                onClick={onRefresh}

            >

                Refresh

            </Button>

            <Button

                variant="outlined"

                startIcon={<DownloadIcon/>}

                onClick={onExport}

            >

                Export

            </Button>

        </Box>

    );

}

export default DashboardToolbar;