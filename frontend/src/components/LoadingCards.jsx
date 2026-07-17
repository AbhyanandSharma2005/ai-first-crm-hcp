import {

    Grid,

    Card,

    CardContent,

    Skeleton

} from "@mui/material";

function LoadingCards() {

    return (

        <Grid
            container
            spacing={3}
        >

            {[1,2,3,4].map((item)=>(

                <Grid

                    item

                    xs={12}

                    sm={6}

                    md={3}

                    key={item}

                >

                    <Card
                        sx={{
                            borderRadius:3
                        }}
                    >

                        <CardContent>

                            <Skeleton

                                variant="text"

                                width="70%"

                                height={30}

                            />

                            <Skeleton

                                variant="text"

                                width="40%"

                                height={60}

                            />

                            <Skeleton

                                variant="text"

                                width="90%"

                            />

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}

export default LoadingCards;