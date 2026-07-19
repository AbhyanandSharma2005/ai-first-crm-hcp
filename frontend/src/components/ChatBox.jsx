import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  useTheme,
  Chip,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import API from "../api/api";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

function ChatBox() {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === 'dark';

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Theme colors
  const textPrimary = isDark ? "#F1F5F9" : "#172033";
  const textSecondary = isDark ? "#94A3B8" : "#475569";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const userMessageBg = isDark ? "#1E293B" : "#F1F5F9";
  const aiMessageBg = isDark ? "#1A2A4A" : "#EAF0FF";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const userMessage = {
      sender: "You",
      text: message,
      isUser: true,
    };

    setChatMessages((previous) => [...previous, userMessage]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/chat/", {
        session_id: "frontend-session",
        message: currentMessage,
      });

      console.log("Chat Response:", response.data);

      let aiResponse = "";

      if (response.data.response) {
        aiResponse = response.data.response;
      } else if (response.data.final_response) {
        aiResponse = response.data.final_response;
      } else if (response.data.message) {
        aiResponse = response.data.message;
      } else {
        aiResponse = JSON.stringify(response.data);
      }

      const aiMessage = {
        sender: "AI Assistant",
        text: aiResponse,
        isUser: false,
      };

      setChatMessages((previous) => [...previous, aiMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setChatMessages((previous) => [
        ...previous,
        {
          sender: "AI Assistant",
          text:
            error.response?.data?.message ||
            "Unable to connect with AI service.",
          isUser: false,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (sender) => {
    if (sender === "You") return "Y";
    return "AI";
  };

  const getAvatarColor = (sender) => {
    if (sender === "You") {
      return isDark ? "#475569" : "#94A3B8";
    }
    return "#8B5CF6";
  };

  const getMessageBg = (sender) => {
    if (sender === "You") {
      return userMessageBg;
    }
    return aiMessageBg;
  };

  const getMessageColor = (sender) => {
    if (sender === "You") {
      return textPrimary;
    }
    return isDark ? "#A78BFA" : "#7C3AED";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 500,
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: cardBg,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          backgroundColor: isDark ? "#0F172A" : "#FAFBFD",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#8B5CF6",
            color: "#FFFFFF",
          }}
        >
          <SmartToyOutlinedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={textPrimary}>
            AI Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ask about HCP interactions
          </Typography>
        </Box>
        <Chip
          label="Online"
          size="small"
          sx={{
            ml: "auto",
            bgcolor: isDark ? "#065F46" : "#DCFCE7",
            color: isDark ? "#6EE7B7" : "#166534",
            fontWeight: 600,
            fontSize: "0.65rem",
          }}
        />
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          "&::-webkit-scrollbar": {
            width: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark ? "#334155" : "#CBD5E1",
            borderRadius: 10,
          },
        }}
      >
        {chatMessages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
              textAlign: "center",
              p: 3,
            }}
          >
            <SmartToyOutlinedIcon
              sx={{ fontSize: 48, color: isDark ? "#334155" : "#CBD5E1", mb: 2 }}
            />
            <Typography variant="body1" fontWeight={600} color={textPrimary}>
              Start a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ask about HCP interactions or get AI assistance
            </Typography>
          </Box>
        )}

        {chatMessages.map((msg, index) => (
          <Box
            key={index}
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
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {msg.text}
              </Typography>
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
        ))}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#8B5CF6",
                color: "#FFFFFF",
              }}
            >
              <SmartToyOutlinedIcon fontSize="small" />
            </Avatar>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: aiMessageBg,
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={16} color="primary" />
              <Typography variant="body2" color="text.secondary">
                AI is thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          gap: 1,
          backgroundColor: isDark ? "#0F172A" : "#FAFBFD",
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask AI CRM Assistant..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          size="small"
          multiline
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              "& fieldset": {
                borderColor: borderColor,
              },
              "&:hover fieldset": {
                borderColor: isDark ? "#475569" : "#94A3B8",
              },
            },
            "& .MuiInputBase-input": {
              color: textPrimary,
            },
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          sx={{
            bgcolor: "#2855D9",
            color: "#FFFFFF",
            borderRadius: 2.5,
            "&:hover": {
              bgcolor: "#1F46BA",
            },
            "&.Mui-disabled": {
              bgcolor: isDark ? "#334155" : "#E2E8F0",
              color: isDark ? "#475569" : "#94A3B8",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendRoundedIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatBox;