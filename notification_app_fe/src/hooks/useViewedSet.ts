"use client";

import { useCallback, useMemo, useState } from "react";
import { getViewedIds, markManyViewed, markViewed } from "@/lib/viewed";

export function useViewedSet() {
  const [version, setVersion] = useState(0);

  const viewed = useMemo(() => {
    void version;
    return getViewedIds();
  }, [version]);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const markOne = useCallback(
    (id: string) => {
      markViewed(id);
      refresh();
    },
    [refresh]
  );

  const markBulk = useCallback(
    (ids: string[]) => {
      markManyViewed(ids);
      refresh();
    },
    [refresh]
  );

  return { viewed, markOne, markBulk, refresh };
}
