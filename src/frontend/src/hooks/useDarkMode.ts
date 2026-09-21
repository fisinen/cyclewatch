import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDark(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const dark = getInitialDark();
    applyDark(dark);
    return dark;
  });

  useEffect(() => {
    applyDark(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Sync with system preference changes when no explicit preference is stored
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return; // user has explicit preference, don't override

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}
