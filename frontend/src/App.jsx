import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./layouts/Layout";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2855D9",
      dark: "#1F46BA",
      light: "#EAF0FF",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#10A683",
      dark: "#078565",
      light: "#E9FBF6",
    },

    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172033",
      secondary: "#64748B",
    },

    divider: "#E7ECF5",

    error: {
      main: "#D14343",
    },
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.035em",
    },

    h3: {
      fontWeight: 750,
      letterSpacing: "-0.03em",
    },

    h4: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },

    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },

        body: {
          margin: 0,
          minWidth: 320,
          backgroundColor: "#F5F7FB",
        },

        "*": {
          boxSizing: "border-box",
        },

        "*::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#C7D1E2",
          borderRadius: 8,
        },

        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#9DAAC0",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 40,
          paddingLeft: 16,
          paddingRight: 16,
        },

        containedPrimary: {
          boxShadow: "0 8px 16px rgba(40, 85, 217, .18)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },

      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#E7ECF5",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: 12,
          backgroundColor: "#172033",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Layout>
        <AppRoutes />
      </Layout>
    </ThemeProvider>
  );
}

export default App;