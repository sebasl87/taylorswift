'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#D32F2F' }, // rojo “metal”
          secondary: { main: '#FF6F00' },
          background: { default: '#fafafa', paper: '#ffffff' },
        }
      : {
          primary: { main: '#EF5350' },
          secondary: { main: '#FFA726' },
          background: { default: '#0e0e10', paper: '#151517' },
        }),
  },
  typography: {
    fontFamily: ['var(--font-poppins)', 'Poppins', 'system-ui', 'Arial'].join(','),
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 700 },
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
});

export const makeTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
