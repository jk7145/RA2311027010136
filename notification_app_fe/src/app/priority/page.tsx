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
  Slider,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { NotificationCard } from "@/components/NotificationCard";
import { fetchNotificationsClient } from "@/lib/fetchNotifications";
import type { NotificationRecord } from "@/lib/notificationTypes";
import { topPriorityUnread } from "@/lib/priority";
import { useViewedSet } from "@/hooks/useViewedSet";
import { Log } from "@campus/logging-middleware";

const FETCH_WINDOW = 120;

export default function PriorityPage() {
  const { viewed, markOne, markBulk } = useViewedSet();
  const [pool, setPool] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState<
    "" | "Placement" | "Result" | "Event"
  >("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotificationsClient({
        page: 1,
        limit: FETCH_WINDOW,
        notificationType: typeFilter,
      });
      setPool(data.notifications);
      void Log(
        "frontend",
        "info",
        "page",
        `Priority page loaded pool=${data.notifications.length}`
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const prioritized = useMemo(
    () => topPriorityUnread(pool, viewed, topN),
    [pool, viewed, topN]
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Priority inbox
        </Typography>
        <Typography color="text.secondary">
          Surfaces the highest-impact unread items first using placement over
          results over events, breaking ties with the newest timestamp.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <Typography gutterBottom>Show top unread count</Typography>
            <Slider
              value={topN}
              min={5}
              max={30}
              step={1}
              marks={[
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              valueLabelDisplay="on"
              onChange={(_, value) => {
                const next = Array.isArray(value) ? value[0] : value;
                setTopN(next);
                void Log(
                  "frontend",
                  "info",
                  "state",
                  `Priority topN changed to ${next}`
                );
              }}
            />
          </FormControl>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="prio-type-label">Source filter</InputLabel>
              <Select
                labelId="prio-type-label"
                label="Source filter"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as typeof typeFilter);
                }}
              >
                <MenuItem value="">All types</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => void load()}>
              Refresh pool
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                markBulk(prioritized.map((p) => p.ID));
                void Log(
                  "frontend",
                  "info",
                  "page",
                  "Marked current priority list as viewed"
                );
              }}
              disabled={prioritized.length === 0}
            >
              Mark priority list viewed
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Pulling up to {FETCH_WINDOW} items (page 1) for the selected type so
            the client can rank unread entries without extra database work.
          </Typography>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Stack alignItems="center" py={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2}>
          {prioritized.length === 0 ? (
            <Alert severity="success">
              You are caught up — no unread notifications in this pool.
            </Alert>
          ) : (
            prioritized.map((item) => (
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
    </Stack>
  );
}
