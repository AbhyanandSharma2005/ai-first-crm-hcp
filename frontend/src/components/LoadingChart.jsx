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
                    width="35%"
                    height={35}
                />

                <Skeleton
                    variant="rounded"
                    height={300}
                />

            </CardContent>

        </Card>

    );

}

export default LoadingChart;