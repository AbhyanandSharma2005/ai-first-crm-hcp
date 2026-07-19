import {
  Box,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import { PieChart } from "@mui/x-charts/PieChart";

const chartColors = [
  "#2855D9",
  "#10A683",
  "#8B5CF6",
  "#F59E0B",
  "#EF5B5B",
  "#14B8A6",
];

function ProductPieChart({ products = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const pieData = Object.entries(products)
    .map(([label, value], id) => ({
      id,
      label,
      value: Number(value) || 0,
      color: chartColors[id % chartColors.length],
    }))
    .filter((item) => item.value > 0);

  const totalInteractions = pieData.reduce(
    (total, item) => total + item.value,
    0
  );

  // Responsive chart dimensions
  const chartWidth = isMobile ? 260 : isTablet ? 280 : 300;
  const chartHeight = isMobile ? 220 : isTablet ? 240 : 260;

  if (!pieData.length) {
    return (
      <Box
        sx={{
          minHeight: 250,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          border: "1px dashed #D9E1F2",
          borderRadius: 3,
          bgcolor: "#FAFBFD",
          px: 3,
        }}
      >
        <Box>
          <DonutLargeOutlinedIcon
            sx={{ color: "#9AA8BA", fontSize: 32, mb: 1 }}
          />

          <Typography fontWeight={700} color="#475569">
            No product activity yet
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Product distribution will appear after interactions are logged.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: chartWidth },
          height: chartHeight,
          position: "relative",
          display: "grid",
          placeItems: "center",
        }}
      >
        <PieChart
          width={chartWidth}
          height={chartHeight}
          hideLegend
          series={[
            {
              data: pieData,
              innerRadius: isMobile ? 50 : 63,
              outerRadius: isMobile ? 85 : 102,
              paddingAngle: 3,
              cornerRadius: 5,
              highlightScope: {
                faded: "global",
                highlighted: "item",
              },
              faded: {
                innerRadius: isMobile ? 45 : 55,
                additionalRadius: -8,
                color: "#DCE4EF",
              },
            },
          ]}
          sx={{
            "& .MuiChartsLegend-root": {
              display: "none",
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color="#172033"
            lineHeight={1}
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
              },
            }}
          >
            {totalInteractions}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 650 }}
          >
            INTERACTIONS
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: { xs: "100%", md: 245 } }}>
        <Typography fontWeight={750} color="#27364D" sx={{ mb: 0.5 }}>
          Product activity
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribution by discussed product.
        </Typography>

        <Divider sx={{ borderColor: "#E7ECF5", mb: 1.25 }} />

        <Stack spacing={1.25}>
          {pieData.map((item) => {
            const percentage = ((item.value / totalInteractions) * 100).toFixed(1);

            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0,
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      flexShrink: 0,
                      borderRadius: "50%",
                      bgcolor: item.color,
                    }}
                  />

                  <Typography
                    variant="body2"
                    fontWeight={650}
                    color="#475569"
                    noWrap
                  >
                    {item.label}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="#64748B"
                  sx={{ flexShrink: 0 }}
                >
                  <Box component="span" fontWeight={750} color="#27364D">
                    {item.value}
                  </Box>{" "}
                  · {percentage}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

export default ProductPieChart;