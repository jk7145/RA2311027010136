"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import type { NotificationRecord } from "@/lib/notificationTypes";
import { Log } from "@campus/logging-middleware";

const typeColor: Record<string, "primary" | "secondary" | "success"> = {
  Placement: "primary",
  Result: "secondary",
  Event: "success",
};

export function NotificationCard({
  item,
  isNew,
  onMarkViewed,
  onOpen,
}: {
  item: NotificationRecord;
  isNew: boolean;
  onMarkViewed: (id: string) => void;
  onOpen?: (item: NotificationRecord) => void;
}) {
  const color = typeColor[item.Type] ?? "primary";

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardActionArea
        onClick={() => {
          onMarkViewed(item.ID);
          onOpen?.(item);
          void Log(
            "frontend",
            "info",
            "component",
            `Opened notification id=${item.ID} type=${item.Type}`
          );
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip size="small" label={item.Type} color={color} />
            {isNew && (
              <Chip size="small" label="New" color="warning" variant="outlined" />
            )}
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {item.Message}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {item.Timestamp}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              ID: {item.ID}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
