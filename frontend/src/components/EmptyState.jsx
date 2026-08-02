import {
    Box,
    Typography,
    Button,
    useTheme
} from "@mui/material";

import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction
}) {

    const theme = useTheme();
    const Icon = icon || InboxOutlinedIcon;

    return (

        <Box
            sx={{
                py: {
                    xs: 6,
                    md: 8
                },
                px: {
                    xs: 2,
                    sm: 4
                },
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper"
            }}
        >

            <Icon
                sx={{
                    fontSize: {
                        xs: 56,
                        md: 72
                    },
                    color: "text.disabled",
                    mb: 2
                }}
            />

            <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{
                    fontSize: {
                        xs: "1.4rem",
                        md: "2rem"
                    },
                    color: theme.palette.text.primary
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    maxWidth: 500,
                    mb: 3,
                    color: "text.secondary"
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