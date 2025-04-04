// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color (Material UI's green 500)
      light: '#81c784', // Optional: Light green
      dark: '#388e3c', // Optional: Dark green
      contrastText: '#fff', // Optional: Text color against primary
    },
    secondary: {
      main: '#9c27b0', // Optional: Customize secondary color (purple)
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f', // Red for errors
      light: '#e57373',
      dark: '#c62828',
      contrastText: '#fff',
    },
    warning: {
      main: '#ed6c02', // Orange for warnings
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1', // Blue for information
      light: '#4fc3f7',
      dark: '#01579b',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32', // Darker Green for success
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#fff', // White for paper components
    },
    text: {
      primary: '#333', // Dark grey for primary text
      secondary: '#757575', // Grey for secondary text
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // You can add more typography customizations here
  },
  components: {
    // You can add component-specific customizations here
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#4caf50', // Ensure AppBar uses primary green
          color: '#fff', // White text on the AppBar
        },
      },
    },
    // Example Button override.
    MuiButton: {
        styleOverrides: {
            containedPrimary: {
                color: 'white',
            }
        }
    }
  },
});

export default theme;