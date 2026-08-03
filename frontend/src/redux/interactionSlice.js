import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";

// -------------------------------------------------------
// Async Thunks
// -------------------------------------------------------

/**
 * Send a message to the AI chat endpoint.
 * POST /chat/
 */
export const sendChatMessage = createAsyncThunk(
  "interaction/sendChatMessage",
  async ({ session_id, message }, { rejectWithValue }) => {
    try {
      const response = await API.post("/chat/", { 
        session_id, 
        message 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to connect with AI service."
      );
    }
  }
);

/**
 * Submit the structured interaction form.
 * POST /interaction/
 */
export const submitInteraction = createAsyncThunk(
  "interaction/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/interaction/", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save interaction."
      );
    }
  }
);

/**
 * Fetch all interactions from the backend.
 * GET /interactions/ (assuming plural endpoint for list based on typical REST, will check routes later)
 * Actually, spec says GET /interactions
 */
export const fetchInteractions = createAsyncThunk(
  "interaction/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/interactions/");
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interactions."
      );
    }
  }
);

// -------------------------------------------------------
// Initial State
// -------------------------------------------------------

const SESSION_ID = "frontend-session";

const initialFormState = {
  hcp_name: "",
  specialization: "",
  hospital: "",
  interaction_date: "",
  interaction_type: "",
  summary: "",
  product: "",
  outcome: "",
  follow_up: "",
  notes: "",
};

const initialState = {
  // Chat
  chatMessages: [],
  chatLoading: false,
  chatError: null,
  sessionId: SESSION_ID,

  // Structured Form
  currentForm: initialFormState,
  formLoading: false,
  formSuccess: null,
  formError: null,

  // Interaction List
  interactions: [],
  interactionsLoading: false,
  interactionsError: null,
};

// -------------------------------------------------------
// Slice
// -------------------------------------------------------

const interactionSlice = createSlice({
  name: "interaction",

  initialState,

  reducers: {
    addUserMessage(state, action) {
      state.chatMessages.push({
        sender: "You",
        text: action.payload,
        isUser: true,
      });
    },
    clearChat(state) {
      state.chatMessages = [];
      state.chatError = null;
    },
    setFormField(state, action) {
      const { field, value } = action.payload;
      state.currentForm[field] = value;
    },
    resetForm(state) {
      state.currentForm = initialFormState;
      state.formSuccess = null;
      state.formError = null;
    },
    clearFormMessages(state) {
      state.formSuccess = null;
      state.formError = null;
    },
  },

  extraReducers: (builder) => {
    // sendChatMessage
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.chatLoading = true;
        state.chatError = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatLoading = false;
        
        // Extract response from the full response object
        // Supports multiple response field names for flexibility
        const responseText = 
          action.payload?.data?.response ||
          action.payload?.response ||
          action.payload?.final_response ||
          action.payload?.message ||
          JSON.stringify(action.payload);
        
        state.chatMessages.push({
          sender: "AI Assistant",
          text: responseText,
          isUser: false,
          // Include additional metadata if available
          metadata: {
            intent: action.payload?.data?.intent || null,
            sources: action.payload?.data?.sources || null,
            scores: action.payload?.data?.scores || null,
            rewritten_query: action.payload?.data?.rewritten_query || null,
          }
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatError = action.payload;
        state.chatMessages.push({
          sender: "AI Assistant",
          text: action.payload || "An error occurred while processing your request.",
          isUser: false,
          isError: true,
        });
      });

    // submitInteraction
    builder
      .addCase(submitInteraction.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
        state.formSuccess = null;
      })
      .addCase(submitInteraction.fulfilled, (state, action) => {
        state.formLoading = false;
        state.formSuccess =
          action.payload?.message || "Interaction saved successfully!";
        state.currentForm = initialFormState;
      })
      .addCase(submitInteraction.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      });

    // fetchInteractions
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.interactionsLoading = true;
        state.interactionsError = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.interactionsLoading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.interactionsLoading = false;
        state.interactionsError = action.payload;
      });
  },
});

export const {
  addUserMessage,
  clearChat,
  setFormField,
  resetForm,
  clearFormMessages,
} = interactionSlice.actions;

export default interactionSlice.reducer;