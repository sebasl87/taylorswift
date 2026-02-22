"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { makeTheme } from "./createTheme";
import { useEra } from "@/context/EraContext";

const createEmotionCache = () => {
  return createCache({ key: "mui", prepend: true });
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => createEmotionCache(), []);
  const { currentEra } = useEra();
  const theme = React.useMemo(() => makeTheme(currentEra), [currentEra]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
