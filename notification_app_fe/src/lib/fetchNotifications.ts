"use client";

import type { NotificationsResponse } from "./notificationTypes";
import { Log } from "@campus/logging-middleware";

export type FetchNotificationsParams = {
  limit?: number;
  page?: number;
  notificationType?: "" | "Event" | "Result" | "Placement";
};

export async function fetchNotificationsClient(
  params: FetchNotificationsParams
): Promise<NotificationsResponse> {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.page != null) qs.set("page", String(params.page));
  if (params.notificationType) {
    qs.set("notification_type", params.notificationType);
  }

  const url = `/api/evaluation/notifications?${qs.toString()}`;
  await Log(
    "frontend",
    "debug",
    "api",
    `Fetching notifications client url=${url}`
  );

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    await Log(
      "frontend",
      "error",
      "api",
      `fetchNotifications failed status=${res.status} body=${text.slice(0, 200)}`
    );
    throw new Error(`Unable to load notifications (${res.status})`);
  }

  const data = (await res.json()) as NotificationsResponse;
  if (!data.notifications || !Array.isArray(data.notifications)) {
    await Log(
      "frontend",
      "error",
      "api",
      "Notifications payload missing notifications array"
    );
    throw new Error("Unexpected response shape from notifications API");
  }

  await Log(
    "frontend",
    "info",
    "api",
    `Loaded notifications count=${data.notifications.length}`
  );
  return data;
}
