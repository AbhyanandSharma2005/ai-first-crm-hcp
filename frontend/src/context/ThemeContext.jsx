import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ============================================================
// Theme Context
// ============================================================

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ============================================================
// Theme Configuration
// ============================================================

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#2855D9",
      light: "#4A7AFF",
      dark: "#1A3FA8",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#10A683",
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    background: {
      default: mode === "light" ? "#F8FAFC" : "#0F172A",
      paper: mode === "light" ? "#FFFFFF" : "#1E293B",
    },
    text: {
      primary: mode === "light" ? "#0F172A" : "#F1F5F9",
      secondary: mode === "light" ? "#475569" : "#94A3B8",
      disabled: mode === "light" ? "#94A3B8" : "#64748B",
    },
    divider: mode === "light" ? "#E2E8F0" : "#334155",
    action: {
      hover: mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.04)",
      selected: mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
      disabled: mode === "light" ? "rgba(0, 0, 0, 0.26)" : "rgba(255, 255, 255, 0.26)",
      disabledBackground: mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.7,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    caption: {
      fontSize: "0.75rem",
      letterSpacing: "0.02em",
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.06)",
    "0 4px 12px rgba(0,0,0,0.04)",
    "0 8px 24px rgba(0,0,0,0.06)",
    "0 12px 32px rgba(0,0,0,0.08)",
    "0 16px 40px rgba(0,0,0,0.10)",
    "0 20px 48px rgba(0,0,0,0.12)",
    "0 24px 56px rgba(0,0,0,0.14)",
    "0 28px 64px rgba(0,0,0,0.16)",
    "0 32px 72px rgba(0,0,0,0.18)",
    "0 36px 80px rgba(0,0,0,0.20)",
    "0 40px 88px rgba(0,0,0,0.22)",
    "0 44px 96px rgba(0,0,0,0.24)",
    "0 48px 104px rgba(0,0,0,0.26)",
    "0 52px 112px rgba(0,0,0,0.28)",
    "0 56px 120px rgba(0,0,0,0.30)",
    "0 60px 128px rgba(0,0,0,0.32)",
    "0 64px 136px rgba(0,0,0,0.34)",
    "0 68px 144px rgba(0,0,0,0.36)",
    "0 72px 152px rgba(0,0,0,0.38)",
    "0 76px 160px rgba(0,0,0,0.40)",
    "0 80px 168px rgba(0,0,0,0.42)",
    "0 84px 176px rgba(0,0,0,0.44)",
    "0 88px 184px rgba(0,0,0,0.46)",
    "0 92px 192px rgba(0,0,0,0.48)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
        outlined: {
          "&:hover": {
            backgroundColor: "rgba(40, 85, 217, 0.04)",
          },
        },
        sizeSmall: {
          padding: "4px 12px",
          fontSize: "0.8125rem",
        },
        sizeLarge: {
          padding: "12px 28px",
          fontSize: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          padding: "8px 14px",
          fontSize: "0.75rem",
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
        head: {
          fontWeight: 700,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

// ============================================================
// Theme Provider Component
// ============================================================

export const ThemeProvider = ({ children }) => {
  const getStoredTheme = () => {
    try {
      const stored = localStorage.getItem("themeMode");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    } catch {
      return "light";
    }
  };

  const [mode, setMode] = useState(getStoredTheme);

  useEffect(() => {
    try {
      localStorage.setItem("themeMode", mode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, [mode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("themeMode")) {
        setMode(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const setTheme = (newMode) => {
    if (newMode === "light" || newMode === "dark") {
      setMode(newMode);
    }
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;