"use client";

import { useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { initLogTransport, Log } from "@campus/logging-middleware";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    secondary: { main: "#6a1b9a" },
    background: { default: "#f5f7fb" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLogTransport(async (body) => {
      await fetch("/api/evaluation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });
    void Log(
      "frontend",
      "info",
      "middleware",
      "Client logging transport wired to evaluation relay"
    );
  }, []);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
