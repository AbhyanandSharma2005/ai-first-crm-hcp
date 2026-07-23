import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicationIcon from "@mui/icons-material/Medication";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

function StructuredCard({ data }) {
  const { mode } = useCustomTheme();
  const isDark = mode === "dark";

  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 1,
        mb: 1,
        bgcolor: cardBg,
        borderColor: borderColor,
        borderRadius: 2,
        minWidth: 250,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          <EventNoteIcon
            sx={{ fontSize: 16, verticalAlign: "text-bottom", mr: 0.5 }}
          />
          Interaction Structured
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1.5}>
          {data.hcp_name && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                <PersonIcon sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                Doctor
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {data.hcp_name}
              </Typography>
            </Grid>
          )}
          {data.product && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                <MedicationIcon sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                Product
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {data.product}
              </Typography>
            </Grid>
          )}
          {data.summary && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Summary
              </Typography>
              <Typography variant="body2">{data.summary}</Typography>
            </Grid>
          )}
          {data.follow_up && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                <CalendarTodayIcon sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                Follow-up
              </Typography>
              <Typography variant="body2">{data.follow_up}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

function ChatMessage({ msg }) {
  const { mode } = useCustomTheme();
  const isDark = mode === "dark";

  const textPrimary = isDark ? "#F1F5F9" : "#172033";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const userMessageBg = isDark ? "#1E293B" : "#F1F5F9";
  const aiMessageBg = isDark ? "#1A2A4A" : "#EAF0FF";

  const getMessageBg = (sender) => {
    return sender === "You" ? userMessageBg : aiMessageBg;
  };

  const getAvatarColor = (sender) => {
    return sender === "You" ? (isDark ? "#475569" : "#94A3B8") : "#8B5CF6";
  };

  // Try to parse structured JSON from AI text
  let structuredData = null;
  let displayText = msg.text;

  if (msg.sender !== "You") {
    try {
      // Sometimes LLMs return JSON inside markdown blocks
      const jsonMatch = msg.text.match(/```json\n([\s\S]*?)\n```/);
      const possibleJson = jsonMatch ? jsonMatch[1] : msg.text;
      const parsed = JSON.parse(possibleJson);
      if (parsed && typeof parsed === "object" && (parsed.hcp_name || parsed.summary || parsed.product)) {
        structuredData = parsed;
        displayText = "I've structured the interaction details below:";
      }
    } catch (e) {
      // Not JSON, just display as text
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
        gap: 1.5,
      }}
    >
      {msg.sender !== "You" && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#8B5CF6",
            color: "#FFFFFF",
            alignSelf: "flex-end",
          }}
        >
          <SmartToyOutlinedIcon fontSize="small" />
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "80%",
          p: 1.5,
          borderRadius: 2,
          bgcolor: getMessageBg(msg.sender),
          border: `1px solid ${borderColor}`,
          color: msg.isError ? "#EF4444" : textPrimary,
        }}
      >
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {displayText}
        </Typography>
        {structuredData && <StructuredCard data={structuredData} />}
      </Box>

      {msg.sender === "You" && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: getAvatarColor(msg.sender),
            color: "#FFFFFF",
            alignSelf: "flex-end",
          }}
        >
          <PersonOutlinedIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}

export default ChatMessage;
