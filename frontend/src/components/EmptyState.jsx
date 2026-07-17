import {

    Paper,

    Typography

} from "@mui/material";

function EmptyState({

    message

}){

    return(

        <Paper

            sx={{

                p:4,

                textAlign:"center",

                borderRadius:3

            }}

        >

            <Typography

                variant="h6"

            >

                {message}

            </Typography>

        </Paper>

    );

}

export default EmptyState;