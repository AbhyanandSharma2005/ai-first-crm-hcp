import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatMessage from "./ChatMessage";
import { addUserMessage, sendChatMessage } from "../redux/interactionSlice";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

function ChatBox() {
  const dispatch = useDispatch();
  const { chatMessages, chatLoading, sessionId } = useSelector(
    (state) => state.interaction
  );
  
  const { mode } = useCustomTheme();
  const isDark = mode === "dark";

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const textPrimary = isDark ? "#F1F5F9" : "#172033";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const aiMessageBg = isDark ? "#1A2A4A" : "#EAF0FF";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatLoading]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const text = message;
    setMessage("");

    // Add user message to UI immediately
    dispatch(addUserMessage(text));
    
    // Trigger backend call
    dispatch(sendChatMessage({ session_id: sessionId, message: text }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
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

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
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
          <ChatMessage key={index} msg={msg} />
        ))}

        {chatLoading && (
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

      {/* Input Area */}
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
          disabled={chatLoading}
          size="small"
          multiline
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              "& fieldset": { borderColor: borderColor },
              "&:hover fieldset": {
                borderColor: isDark ? "#475569" : "#94A3B8",
              },
            },
            "& .MuiInputBase-input": { color: textPrimary },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={chatLoading || !message.trim()}
          sx={{
            bgcolor: "#2855D9",
            color: "#FFFFFF",
            borderRadius: 2.5,
            "&:hover": { bgcolor: "#1F46BA" },
            "&.Mui-disabled": {
              bgcolor: isDark ? "#334155" : "#E2E8F0",
              color: isDark ? "#475569" : "#94A3B8",
            },
          }}
        >
          {chatLoading ? (
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