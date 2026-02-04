'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Era } from '@/constants/eras';

export const getDesignTokens = (mode: 'light' | 'dark', era?: Era): ThemeOptions => {
  const palette = era ? {
    mode,
    primary: { main: era.colors.primary },
    secondary: { main: era.colors.secondary },
    background: { default: era.colors.background, paper: era.colors.paper },
    text: { primary: era.colors.text },
  } : {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#D32F2F' }, // rojo “metal”
          secondary: { main: '#FF6F00' },
          background: { default: '#fafafa', paper: '#ffffff' },
        }
      : {
        primary: { main: '#C3A6E8' },
        secondary: { main: '#FFC2CF' },
        background: { default: '#1C1F2B', paper: '#24283A' }, // azul oscuro elegante
      }),
  };

  return {
    palette,
    typography: {
      fontFamily: ['var(--font-body)', 'Inter', 'system-ui', 'Arial'].join(','),
      h1: { fontFamily: era?.fontHeading || 'var(--font-heading)', fontWeight: 700, letterSpacing: -0.5 },
      h2: { fontFamily: era?.fontHeading || 'var(--font-heading)', fontWeight: 600 },
      h3: { fontFamily: era?.fontHeading || 'var(--font-heading)', fontWeight: 600 },
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

export const makeTheme = (mode: 'light' | 'dark', era?: Era) => createTheme(getDesignTokens(mode, era));
