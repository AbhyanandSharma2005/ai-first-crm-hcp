import {

    Card,

    CardContent,

    Skeleton

} from "@mui/material";

function LoadingChart() {

    return (

        <Card
            sx={{
                borderRadius: 4
            }}
        >

            <CardContent>

                <Skeleton
                    animation="wave"
                    width="35%"
                    height={35}
                />

                <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={300}
                />

            </CardContent>

        </Card>

    );

}

export default LoadingChart;