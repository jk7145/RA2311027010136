"use client";

import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Stay on top of what matters
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          Browse every announcement from the evaluation feed, or jump into the
          priority inbox that surfaces the most important unread items first.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            flex: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            All notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paginated list with optional type filters aligned to the evaluation
            API query parameters.
          </Typography>
          <Button component={Link} href="/notifications" variant="contained">
            Open inbox
          </Button>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            flex: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Priority inbox
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose how many unread items to spotlight. Ordering blends category
            importance with freshness.
          </Typography>
          <Button component={Link} href="/priority" variant="outlined">
            Open priority
          </Button>
        </Paper>
      </Stack>
    </Stack>
  );
}
