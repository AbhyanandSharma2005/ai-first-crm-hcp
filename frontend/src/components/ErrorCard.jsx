import {

    Alert,

    Button,

    Stack

} from "@mui/material";

function ErrorCard({

    message,

    onRetry

}){

    return(

        <Stack spacing={2}>

            <Alert severity="error">

                {message}

            </Alert>

            <Button

                variant="contained"

                onClick={onRetry}

            >

                Retry

            </Button>

        </Stack>

    );

}

export default ErrorCard;