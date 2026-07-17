import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function RecentInteractionsTable({ interactions }) {

    if (!interactions || interactions.length === 0) {

        return (

            <Typography
                sx={{ mt: 3 }}
            >

                No recent interactions found.

            </Typography>

        );

    }

    return (

        <TableContainer

            component={Paper}

            sx={{

                mt: 4,

                borderRadius: 3

            }}

        >

            <Typography

                variant="h6"

                sx={{

                    p: 2,

                    fontWeight: 600

                }}

            >

                Recent Interactions

            </Typography>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>

                            ID

                        </TableCell>

                        <TableCell>

                            HCP

                        </TableCell>

                        <TableCell>

                            Product

                        </TableCell>

                        <TableCell>

                            Summary

                        </TableCell>

                        <TableCell>

                            Follow Up

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        interactions.map(

                            (interaction) => (

                                <TableRow

                                    key={interaction.id}

                                >

                                    <TableCell>

                                        {interaction.id}

                                    </TableCell>

                                    <TableCell>

                                        {interaction.hcp_name}

                                    </TableCell>

                                    <TableCell>

                                        {interaction.product}

                                    </TableCell>

                                    <TableCell>

                                        {interaction.summary}

                                    </TableCell>

                                    <TableCell>

                                        {

                                            interaction.follow_up ||

                                            "-"

                                        }

                                    </TableCell>

                                </TableRow>

                            )

                        )

                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default RecentInteractionsTable;