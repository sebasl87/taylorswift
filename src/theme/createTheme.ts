'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Era, ERAS } from '@/constants/eras';

export const getDesignTokens = (era: Era): ThemeOptions => {
  // Use dark mode for Reputation and Midnights eras
  const mode = era.id === 'reputation' || era.id === 'midnights' ? 'dark' : 'light';
  
  return {
    palette: {
      mode,
      primary: { main: era.colors.primary },
      secondary: { main: era.colors.secondary },
      background: { default: era.colors.background, paper: era.colors.paper },
      text: { primary: era.colors.text },
    },
    typography: {
      fontFamily: ['var(--font-body)', 'Montserrat', 'system-ui', 'sans-serif'].join(','),
      h1: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 700, letterSpacing: -0.5 },
      h2: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 700, letterSpacing: -0.3 },
      h3: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 600 },
      h4: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 600 },
      h5: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 600 },
      h6: { fontFamily: era.fontHeading || 'var(--font-heading)', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.5s ease, color 0.5s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.5s ease, color 0.5s ease',
          },
        },
      },
    },
  };
};

export const makeTheme = (era?: Era) => {
  const currentEra = era || ERAS[0]; // Default to Taylor Swift (Debut)
  return createTheme(getDesignTokens(currentEra));
};
