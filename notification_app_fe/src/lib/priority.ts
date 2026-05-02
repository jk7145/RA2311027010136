import type { NotificationRecord, NotificationType } from "./notificationTypes";
import { Log } from "@campus/logging-middleware";

const WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function parseNotificationTime(ts: string): number {
  const normalized = ts.includes("T") ? ts : ts.replace(" ", "T");
  return new Date(normalized).getTime();
}

/**
 * Higher score sorts first: primary by type weight, secondary by recency.
 */
export function priorityScore(n: NotificationRecord): number {
  const w = WEIGHT[n.Type] ?? 0;
  const t = parseNotificationTime(n.Timestamp);
  return w * 1e15 + t;
}

export function comparePriority(a: NotificationRecord, b: NotificationRecord): number {
  return priorityScore(b) - priorityScore(a);
}

/**
 * Top-N priority among unread items, using type weight then recency.
 */
export function topPriorityUnread(
  items: NotificationRecord[],
  viewed: Set<string>,
  n: number
): NotificationRecord[] {
  const unread = items.filter((x) => !viewed.has(x.ID));
  unread.sort(comparePriority);
  const slice = unread.slice(0, n);
  void Log(
    "frontend",
    "debug",
    "utils",
    `Computed priority inbox: unreadPool=${unread.length}, n=${n}, selected=${slice.length}`
  );
  return slice;
}
