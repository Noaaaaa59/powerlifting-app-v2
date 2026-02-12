"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useAuthStore } from "@/lib/stores/auth-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, applyTheme, mode } = useThemeStore();
  const { userData } = useAuthStore();

  // Sync theme from user preferences
  useEffect(() => {
    const color = userData?.preferences?.themeColor ?? "rouge";
    const m = userData?.preferences?.themeMode ?? "dark";
    setTheme(color, m);
  }, [userData?.preferences?.themeColor, userData?.preferences?.themeMode, setTheme]);

  // Listen for system theme changes in auto mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (useThemeStore.getState().mode === "auto") {
        applyTheme();
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [applyTheme]);

  return <>{children}</>;
}
