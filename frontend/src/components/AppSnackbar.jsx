import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function AppSnackbar({
  open,
  onClose,
  severity = "success",
  message,
  autoHideDuration = 4000,
}) {
  // Determine auto-hide duration based on severity
  const getAutoHideDuration = () => {
    // If custom autoHideDuration is provided, use it
    if (autoHideDuration !== 4000) {
      return autoHideDuration;
    }
    // Otherwise, use longer duration for errors
    return severity === "error" ? 6000 : 4000;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={getAutoHideDuration()}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;