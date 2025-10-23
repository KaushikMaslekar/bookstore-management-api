import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#2C3E50", // Deep blue-gray, professional and calming
      light: "#34495E",
      dark: "#1A252F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E67E22", // Warm orange for accents
      light: "#F39C12",
      dark: "#D35400",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E74C3C",
      light: "#FF6B6B",
      dark: "#C0392B",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#7F8C8D",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01562em",
      marginBottom: "0.5em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.00833em",
      marginBottom: "0.5em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      letterSpacing: "0em",
      marginBottom: "0.5em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: "0.00735em",
      marginBottom: "0.5em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "0em",
      marginBottom: "0.5em",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "0.0075em",
      marginBottom: "0.5em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.00938em",
    },
    body1: {
      fontSize: "1rem",
      letterSpacing: "0.00938em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
      fontSize: "1rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
