import {
    Box,
    Typography,
    Button
} from "@mui/material";

import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction
}) {

    const Icon = icon || InboxOutlinedIcon;

    return (

        <Box
            sx={{
                py: 8,
                px: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >

            <Icon
                sx={{
                    fontSize: 72,
                    color: "text.disabled",
                    mb: 2
                }}
            />

            <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
            >
                {title}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    maxWidth: 500,
                    mb: 3
                }}
            >
                {description}
            </Typography>

            {actionLabel && (

                <Button
                    variant="contained"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>

            )}

        </Box>

    );

}

export default EmptyState;