"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import HomeIcon from "@mui/icons-material/Home";
import { Log } from "@campus/logging-middleware";
import { useEffect } from "react";

const navItems = [
  { href: "/", label: "Home", icon: <HomeIcon /> },
  { href: "/notifications", label: "Inbox", icon: <NotificationsIcon /> },
  { href: "/priority", label: "Priority", icon: <StarIcon /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    void Log(
      "frontend",
      "info",
      "component",
      `Shell mounted for route=${pathname}`
    );
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0} color="inherit">
        <Toolbar sx={{ gap: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Campus Notifications
          </Typography>
          {isDesktop &&
            navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color={pathname === item.href ? "primary" : "inherit"}
                variant={pathname === item.href ? "contained" : "text"}
                sx={{ textTransform: "none", borderRadius: 999 }}
              >
                {item.label}
              </Button>
            ))}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, pb: { xs: 8, md: 3 } }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>

      {!isDesktop && (
        <BottomNavigation
          showLabels
          value={pathname}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.href}
              label={item.label}
              icon={item.icon}
              component={Link}
              href={item.href}
              value={item.href}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
