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
  Button,
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

// Reusable button style object with focus visibility
const buttonSx = {
  borderRadius: 3,
  px: 3,
  py: 1.2,
  textTransform: "none",
  fontWeight: 600,
  transition: "all .25s ease",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0,0,0,.15)"
  },
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

// Focus visibility for cards
const cardFocusSx = {
  "&:focus-visible": {
    outline: "3px solid #1976D2",
    outlineOffset: 2,
    borderRadius: 6
  }
};

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
        mb: 3.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 4,
          bgcolor: isDark ? `${color}30` : `${color}16`,
          color,
          "&:focus-visible": {
            outline: "3px solid #1976D2",
            outlineOffset: 2,
            borderRadius: 6
          }
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          color={isDark ? "#F1F5F9" : "#172033"}
          sx={{ mb: 0.5 }}
        >
          {title}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 0.25,
            color: "#475569" // Improved contrast
          }}
        >
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
    borderRadius: 5,
    border: `1px solid ${borderColor}`,
    boxShadow: 1,
    overflow: "hidden",
    backgroundColor: cardBg,
    transition: "0.25s",
    "&:hover": {
      boxShadow: 4,
    },
    ...cardFocusSx,
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
      component="main"
      role="main"
      aria-label="Log Interaction Main Content"
      sx={{ 
        width: "100%",
        pb: 5,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        minHeight: "100vh",
        p: commonSpacing.pagePadding,
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Chip
            label="HCP ACTIVITY"
            size="small"
            aria-label="HCP Activity"
            sx={{
              bgcolor: chipBg,
              color: chipColor,
              borderRadius: 2,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.09em",
              "&:focus-visible": {
                outline: "3px solid #1976D2",
                outlineOffset: 2,
                borderRadius: 6
              }
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          sx={{
            color: textPrimary,
            ...commonTypography.pageTitle,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            mb: 1,
          }}
        >
          Log an interaction
        </Typography>

        <Typography
          variant="body1"
          sx={{ 
            mt: 0.5, 
            maxWidth: 680, 
            lineHeight: 1.8,
            color: "#475569" // Improved contrast
          }}
        >
          Capture meaningful HCP conversations, use AI to structure insights,
          and make every follow-up action clear to your field team.
        </Typography>
      </Box>

      {/* Hero Card - Enhanced with larger padding */}
      <Card
        tabIndex={0}
        role="article"
        aria-label="Workflow overview"
        sx={{
          mb: 5,
          borderRadius: 5,
          overflow: "hidden",
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at 90% 0%, rgba(138, 180, 255, .45), transparent 30%), linear-gradient(130deg, #172554 0%, #2855D9 100%)",
          boxShadow: "0 16px 32px rgba(37, 84, 217, .18)",
          transition: "all .3s ease",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none"
          },
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 24px 48px rgba(37, 84, 217, .25)"
          },
          ...cardFocusSx,
        }}
      >
        <CardContent sx={{ 
          p: { 
            xs: 3.5, 
            sm: 4.5, 
            md: 5.5 
          } 
        }}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              mb: 1.5,
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
                md: "1.75rem",
              }
            }}
          >
            A better workflow for every field visit
          </Typography>

          <Typography
            variant="body2"
            sx={{ 
              color: "rgba(255,255,255,.82)", 
              maxWidth: 780, 
              lineHeight: 1.8,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              }
            }}
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
          <Card 
            tabIndex={0}
            role="article"
            aria-label="Structured interaction form"
            sx={sectionCardSx}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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
          <Card 
            tabIndex={0}
            role="article"
            aria-label="AI conversation assistant"
            sx={sectionCardSx}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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
          <Card 
            tabIndex={0}
            role="article"
            aria-label="Interaction history"
            sx={sectionCardSx}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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