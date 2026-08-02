import {

    Box,

    Skeleton

} from "@mui/material";

function LoadingTable({

    rows = 6

}) {

    return (

        <Box>

            {

                [...Array(rows)].map((_, index) => (

                    <Skeleton

                        key={index}

                        animation="wave"

                        variant="rounded"

                        height={55}

                        sx={{

                            mb: 1,

                            borderRadius: 2

                        }}

                    />

                ))

            }

        </Box>

    );

}

export default LoadingTable;