import { createTheme } from '@mui/material/styles';
import React from 'react';

export const primaryColor = '#77469b';

export const theme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 400,
          fontSize: '1.2rem',
          letterSpacing: '-0.013rem',
        },
      },
    },
  },
});

export const fontWeightTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: '1.2rem',
          letterSpacing: '-0.035rem',
        },
      },
    },
  },
});

export const subMenuFontWeightTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: '-0.02rem',
        },
      },
    },
  },
});

export const subMenuTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: '-0.035rem',
        },
      },
    },
  },
});

export const subMenuStyles = (isHovered: boolean): React.CSSProperties => {
  return {
    maxWidth: '100%',
    marginTop: '0.8rem',
    borderRadius: '0 0 0.8rem 0.8rem',
    opacity: isHovered ? 1 : 0,
    transition: 'all 0.4s ease',
    pointerEvents: isHovered ? 'all' : 'none',
  };
};

export const popoverContentStyles: React.CSSProperties = {
  borderRadius: '0 0.8rem 0.8rem 0',
  boxShadow: '0.2rem 0.2rem 0.2rem 0rem rgba(0,0,0,0.15)',
  padding: '0.2rem 1rem',
  border: 'none',
  background: '#f5f6f7',
  zIndex: '10000',
};
