import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";

const COLORS = [
  "#2855D9",
  "#10A683",
  "#8B5CF6",
  "#F59E0B",
  "#EF5B5B",
  "#14B8A6",
];

function ProductChart({ products = {} }) {
  const data = Object.entries(products)
    .map(([name, value]) => ({
      name,
      value: Number(value) || 0,
    }))
    .filter((item) => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) {
    return (
      <Box
        sx={{
          minHeight: 260,
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
          <BarChartRoundedIcon
            sx={{ fontSize: 34, color: "#9AA8BA", mb: 1 }}
          />
          <Typography fontWeight={700} color="#475569">
            No product analytics available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Log interactions to see product performance and share.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <ChartHeader
              icon={<BarChartRoundedIcon />}
              color="#2855D9"
              title="Product performance"
              subtitle="Interactions by discussed product"
            />

            <Box sx={{ height: 310, mt: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 16, right: 12, left: -18, bottom: 8 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#E8EDF5"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718096", fontSize: 12 }}
                    interval={0}
                    angle={data.length > 4 ? -25 : 0}
                    textAnchor={data.length > 4 ? "end" : "middle"}
                    height={data.length > 4 ? 60 : 35}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718096", fontSize: 12 }}
                  />

                  <Tooltip content={<BarTooltip />} cursor={{ fill: "#F4F7FF" }} />

                  <Bar
                    dataKey="value"
                    name="Interactions"
                    fill="#2855D9"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <ChartHeader
              icon={<DonutLargeOutlinedIcon />}
              color="#10A683"
              title="Product share"
              subtitle={`${total} total interactions`}
            />

            <Box
              sx={{
                height: 205,
                position: "relative",
                display: "grid",
                placeItems: "center",
                mt: 1,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={83}
                    paddingAngle={3}
                    cornerRadius={5}
                    stroke="none"
                  >
                    {data.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<PieTooltip total={total} />} />
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: "absolute",
                  pointerEvents: "none",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={800} color="#172033">
                  {total}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                >
                  TOTAL
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {data.map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1);

                return (
                  <Box
                    key={item.name}
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
                        gap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 9,
                          height: 9,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: COLORS[index % COLORS.length],
                        }}
                      />

                      <Typography
                        variant="body2"
                        fontWeight={650}
                        color="#475569"
                        noWrap
                      >
                        {item.name}
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function ChartHeader({ icon, color, title, subtitle }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 40,
          height: 40,
          borderRadius: 2.25,
          bgcolor: `${color}16`,
          color,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography fontWeight={750} color="#27364D">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        bgcolor: "#172033",
        color: "#FFFFFF",
        borderRadius: 2,
        boxShadow: "0 8px 18px rgba(15,23,42,.2)",
      }}
    >
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,.7)" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {payload[0].value} interactions
      </Typography>
    </Box>
  );
}

function PieTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const percentage = ((item.value / total) * 100).toFixed(1);

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        bgcolor: "#172033",
        color: "#FFFFFF",
        borderRadius: 2,
        boxShadow: "0 8px 18px rgba(15,23,42,.2)",
      }}
    >
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,.7)" }}>
        {item.name}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {item.value} interactions · {percentage}%
      </Typography>
    </Box>
  );
}

const chartCardSx = {
  height: "100%",
  borderRadius: 4,
  border: "1px solid #E7ECF5",
  boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
};

export default ProductChart;