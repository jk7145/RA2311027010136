"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { NotificationCard } from "@/components/NotificationCard";
import { fetchNotificationsClient } from "@/lib/fetchNotifications";
import type { NotificationRecord } from "@/lib/notificationTypes";
import { useViewedSet } from "@/hooks/useViewedSet";
import { Log } from "@campus/logging-middleware";

const LIMIT_OPTIONS = [10, 15, 20, 50] as const;

export default function NotificationsPage() {
  const { viewed, markOne, markBulk } = useViewedSet();
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [typeFilter, setTypeFilter] = useState<
    "" | "Placement" | "Result" | "Event"
  >("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotificationsClient({
        page,
        limit,
        notificationType: typeFilter,
      });
      setItems(data.notifications);
      void Log(
        "frontend",
        "info",
        "page",
        `Notifications page hydrated rows=${data.notifications.length}`
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [limit, page, typeFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleIds = useMemo(() => items.map((n) => n.ID), [items]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          All notifications
        </Typography>
        <Typography color="text.secondary">
          Server-backed pagination and type filters. Tap a card to mark it as
          viewed; new items stay highlighted until you open them.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            label="Type"
            value={typeFilter}
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value as typeof typeFilter);
            }}
          >
            <MenuItem value="">All types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="limit-label">Page size</InputLabel>
          <Select
            labelId="limit-label"
            label="Page size"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
          >
            {LIMIT_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt} per page
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => {
            markBulk(visibleIds);
            void Log(
              "frontend",
              "info",
              "page",
              "Marked all visible notifications as viewed"
            );
          }}
          disabled={visibleIds.length === 0}
        >
          Mark page as viewed
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Stack alignItems="center" py={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.length === 0 ? (
            <Alert severity="info">No notifications for this filter.</Alert>
          ) : (
            items.map((item) => (
              <NotificationCard
                key={item.ID}
                item={item}
                isNew={!viewed.has(item.ID)}
                onMarkViewed={markOne}
              />
            ))
          )}
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Button
          variant="outlined"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous page
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {page}
        </Typography>
        <Button
          variant="outlined"
          disabled={loading || items.length < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Next page
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        Next stays disabled when this page returns fewer rows than the page
        size, which usually means you have reached the final page.
      </Typography>
    </Stack>
  );
}
