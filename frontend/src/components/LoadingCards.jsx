import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
} from "@mui/material";

function LoadingCards({ count = 4 }) {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }, (_, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            sx={{
              height: "100%",
              minHeight: 188,
              borderRadius: 3.5,
              border: "1px solid #E7ECF5",
              boxShadow: "0 8px 22px rgba(15, 23, 42, .04)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={46}
                  height={46}
                  sx={{ borderRadius: 2.5 }}
                />

                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={62}
                  height={22}
                  sx={{ borderRadius: 5 }}
                />
              </Box>

              <Skeleton
                variant="text"
                animation="wave"
                width="52%"
                height={22}
                sx={{ mb: 0.5 }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                width="38%"
                height={48}
                sx={{ mb: 1.25 }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                width="78%"
                height={18}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default LoadingCards;