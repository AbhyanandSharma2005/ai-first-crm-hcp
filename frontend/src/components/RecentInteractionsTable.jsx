import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from "@mui/material";

function RecentInteractionsTable({ interactions }) {

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
                    Recent Interactions
                </Typography>

                {

                    !interactions ||

                    interactions.length === 0 ?

                    (

                        <Typography
                            color="text.secondary"
                        >

                            No recent interactions available.

                        </Typography>

                    )

                    :

                    (

                        <TableContainer
                            component={Paper}
                            elevation={0}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            <b>ID</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>HCP</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Product</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Summary</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Follow Up</b>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {

                                        interactions.map((item) => (

                                            <TableRow
                                                key={item.id}
                                                hover
                                            >

                                                <TableCell>

                                                    {item.id}

                                                </TableCell>

                                                <TableCell>

                                                    {item.hcp_name}

                                                </TableCell>

                                                <TableCell>

                                                    <Chip

                                                        label={

                                                            item.product ||

                                                            "Unknown"

                                                        }

                                                        color="primary"
                                                        size="small"

                                                    />

                                                </TableCell>

                                                <TableCell>

                                                    {item.summary}

                                                </TableCell>

                                                <TableCell>

                                                    {

                                                        item.follow_up ||

                                                        "-"

                                                    }

                                                </TableCell>

                                            </TableRow>

                                        ))

                                    }

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )

                }

            </CardContent>

        </Card>

    );

}

export default RecentInteractionsTable;