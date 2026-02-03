// src/theme/doctorTheme.js
import { createTheme } from '@mui/material/styles';

const doctorTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // medical blue
    },
    secondary: {
      main: '#607d8b',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f1f5f9',
        },
        body: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default doctorTheme;
