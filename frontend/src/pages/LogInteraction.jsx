import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import InteractionForm from "../components/InteractionForm";
import ChatBox from "../components/ChatBox";
import InteractionHistory from "../components/InteractionHistory";
import AppSnackbar from "../components/AppSnackbar";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import { commonSpacing, commonTypography } from "../theme/theme";

function SectionHeader({ icon, title, description, color }) {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';

  return (
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
          bgcolor: isDark ? `${color}30` : `${color}16`,
          color,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} color={isDark ? "#F1F5F9" : "#172033"}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function LogInteraction() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const textPrimary = isDark ? "#F1F5F9" : "#172033";
  const borderColor = isDark ? "#334155" : "#E7ECF5";
  const chipBg = isDark ? "#1A2A4A" : "#EAF1FF";
  const chipColor = isDark ? "#60A5FA" : "#2855D9";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";

  const sectionCardSx = {
    height: "100%",
    borderRadius: 4,
    border: `1px solid ${borderColor}`,
    boxShadow: 1,
    overflow: "hidden",
    backgroundColor: cardBg,
    transition: "0.25s",
    "&:hover": {
      boxShadow: 4,
    },
  };

  // Handler for InteractionForm submission
  const handleInteractionFormSubmit = async (formData) => {
    try {
      // Validation is now handled inside InteractionForm
      // The form will validate before calling this handler
      
      // API call would be made here
      // const response = await API.post("/interaction", formData);
      
      // On success
      showSnackbar("success", "Interaction logged successfully.");
      return true;
    } catch (err) {
      console.error(err);
      showSnackbar("error", "Failed to save interaction.");
      return false;
    }
  };

  // Handler for ChatBox AI submission
  const handleChatSubmit = async (chatData) => {
    try {
      // Validation is now handled inside ChatBox
      // The chat component will validate before calling this handler
      
      // API call would be made here
      // const response = await API.post("/ai/assist", chatData);
      
      // On success - no snackbar needed as chat message is feedback
      return true;
    } catch (err) {
      console.error(err);
      showSnackbar("error", "AI assistant encountered an error.");
      return false;
    }
  };

  // Handler for InteractionHistory updates
  const handleHistoryUpdate = async (updateData) => {
    try {
      // Validation is now handled inside InteractionHistory
      // The history component will validate before calling this handler
      
      // API call would be made here
      // const response = await API.put(`/interaction/${updateData.id}`, updateData);
      
      // On success
      showSnackbar("success", "Interaction updated.");
      return true;
    } catch (err) {
      console.error(err);
      showSnackbar("error", "Failed to update interaction.");
      return false;
    }
  };

  return (
    <Box 
      sx={{ 
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        pb: 5,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        minHeight: "100vh",
        p: commonSpacing.pagePadding,
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 1.25 }}
        >
          <Chip
            label="HCP ACTIVITY"
            size="small"
            sx={{
              bgcolor: chipBg,
              color: chipColor,
              borderRadius: 2,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.09em",
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          sx={{
            color: textPrimary,
            ...commonTypography.pageTitle,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Log an interaction
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5, maxWidth: 680, lineHeight: 1.7 }}
        >
          Capture meaningful HCP conversations, use AI to structure insights,
          and make every follow-up action clear to your field team.
        </Typography>
      </Box>

      {/* Hero Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at 90% 0%, rgba(138, 180, 255, .45), transparent 30%), linear-gradient(130deg, #172554 0%, #2855D9 100%)",
          boxShadow: "0 16px 32px rgba(37, 84, 217, .18)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.75 }}>
            A better workflow for every field visit
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,.82)", maxWidth: 780 }}
          >
            Start with the structured form for complete records, or ask the AI
            assistant to help turn unstructured notes into useful CRM data.
          </Typography>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <Grid container spacing={commonSpacing.gridSpacing} alignItems="stretch">
        {/* Structured Interaction Form */}
        <Grid item xs={12} lg={7}>
          <Card sx={sectionCardSx}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<EditNoteOutlinedIcon />}
                title="Structured interaction form"
                description="Create a consistent, searchable HCP engagement record."
                color="#2855D9"
              />

              <InteractionForm 
                onSubmit={handleInteractionFormSubmit}
                onSuccess={(message) => {
                  showSnackbar("success", message || "Interaction logged successfully.");
                }} 
                onError={(message) => {
                  showSnackbar("error", message || "Failed to save interaction.");
                }}
                onValidationError={(errors) => {
                  // Show a generic validation message
                  showSnackbar("warning", "Please complete all required fields.");
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* AI Conversation Assistant */}
        <Grid item xs={12} lg={5}>
          <Card sx={sectionCardSx}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<AutoAwesomeOutlinedIcon />}
                title="AI conversation assistant"
                description="Use natural language to capture notes and get next-step guidance."
                color="#8B5CF6"
              />

              <ChatBox 
                onSubmit={handleChatSubmit}
                onSuccess={(message) => {
                  // No snackbar - chat message provides feedback
                }} 
                onError={(message) => {
                  showSnackbar("error", message || "AI assistant encountered an error.");
                }}
                onValidationError={() => {
                  showSnackbar("warning", "Please enter a message.");
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Interaction History */}
        <Grid item xs={12}>
          <Card sx={sectionCardSx}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<HistoryOutlinedIcon />}
                title="Interaction history"
                description="Review and update previously recorded HCP interactions."
                color="#10A683"
              />

              <InteractionHistory 
                onUpdate={handleHistoryUpdate}
                onSuccess={(message) => {
                  showSnackbar("success", message || "Interaction updated.");
                }} 
                onError={(message) => {
                  showSnackbar("error", message || "Failed to update interaction.");
                }}
                onValidationError={() => {
                  showSnackbar("warning", "Please complete all required fields.");
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* App Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default LogInteraction;