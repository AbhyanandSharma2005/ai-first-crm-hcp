import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function AppSnackbar({

    open,

    onClose,

    severity = "success",

    message,

    autoHideDuration = 4000

}) {

    return (

        <Snackbar

            open={open}

            autoHideDuration={autoHideDuration}

            onClose={onClose}

            anchorOrigin={{

                vertical: "bottom",

                horizontal: "right"

            }}

        >

            <Alert

                severity={severity}

                onClose={onClose}

                variant="filled"

                sx={{

                    width: "100%",

                    borderRadius: 2,

                    fontWeight: 600

                }}

            >

                {message}

            </Alert>

        </Snackbar>

    );

}

export default AppSnackbar;