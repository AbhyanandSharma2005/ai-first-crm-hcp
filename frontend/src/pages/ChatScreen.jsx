import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ChatBox from "../components/ChatBox";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing, commonTypography } from "../theme/theme";

function ChatScreen() {
  const { mode } = useCustomTheme();
  const isDark = mode === "dark";
  const textPrimary = isDark ? "#F1F5F9" : "#172033";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        pb: 5,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        minHeight: "100vh",
        p: commonSpacing.pagePadding,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: textPrimary,
            ...commonTypography.pageTitle,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          AI Chat Assistant
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5, maxWidth: 680, lineHeight: 1.7 }}
        >
          Converse with the AI CRM Assistant to quickly search previous HCP interactions,
          draft follow-up actions, or structure unstructured notes.
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${isDark ? "#334155" : "#E7ECF5"}`,
          boxShadow: 1,
          overflow: "hidden",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                borderRadius: 3,
                bgcolor: isDark ? "#8B5CF630" : "#8B5CF616",
                color: "#8B5CF6",
              }}
            >
              <AutoAwesomeOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color={textPrimary}
              >
                Intelligent Search & Structuring
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Use natural language to extract, search, and update CRM records.
              </Typography>
            </Box>
          </Box>

          <ChatBox />
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChatScreen;
