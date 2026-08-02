import {
    Grid,
    Card,
    Skeleton
} from "@mui/material";

function LoadingCards({

    count = 4,

    height = 140

}) {

    return (

        <Grid
            container
            spacing={3}
        >

            {

                [...Array(count)].map((_, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={3}
                        key={index}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                p: 2
                            }}
                        >

                            <Skeleton
                                variant="text"
                                width="45%"
                                height={30}
                            />

                            <Skeleton
                                variant="text"
                                width="70%"
                                height={55}
                            />

                            <Skeleton
                                variant="rounded"
                                height={height}
                            />

                        </Card>

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default LoadingCards;