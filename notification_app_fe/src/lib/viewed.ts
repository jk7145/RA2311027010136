import { Log } from "@campus/logging-middleware";

const STORAGE_KEY = "campus_notifications_viewed_v1";

function readSet(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function persist(next: Set<string>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
}

export function getViewedIds(): Set<string> {
  return readSet();
}

export function isViewed(id: string): boolean {
  return readSet().has(id);
}

export function markViewed(id: string): void {
  const next = readSet();
  if (next.has(id)) {
    return;
  }
  next.add(id);
  persist(next);
  void Log(
    "frontend",
    "info",
    "state",
    `Marked notification viewed id=${id}, totalViewed=${next.size}`
  );
}

export function markManyViewed(ids: string[]): void {
  const next = readSet();
  let added = 0;
  for (const id of ids) {
    if (!next.has(id)) {
      next.add(id);
      added += 1;
    }
  }
  if (added > 0) {
    persist(next);
    void Log(
      "frontend",
      "info",
      "state",
      `Bulk marked viewed count=${added}, totalViewed=${next.size}`
    );
  }
}

export function clearViewed(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  void Log("frontend", "warn", "state", "Cleared all viewed notification markers");
}
