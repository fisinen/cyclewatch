import { useCallback, useState } from "react";

const STORAGE_KEY = "autoRefresh";

function getInitialAutoRefresh(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "false") return false;
  return true; // default enabled
}

export function useAutoRefresh() {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(
    getInitialAutoRefresh,
  );

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { autoRefresh, toggleAutoRefresh };
}
