import { create } from "zustand";
import type { ThemeColor, ThemeMode } from "@/types/user";

const COLOR_CLASSES: ThemeColor[] = ["neutre", "forest", "rose", "ocean", "sunset"];

interface ThemeState {
  color: ThemeColor;
  mode: ThemeMode;
  setTheme: (color: ThemeColor, mode: ThemeMode) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  color: "rouge",
  mode: "dark",

  setTheme: (color, mode) => {
    set({ color, mode });
    get().applyTheme();
  },

  applyTheme: () => {
    const { color, mode } = get();
    const root = document.documentElement;

    // Remove all color classes, then add current
    COLOR_CLASSES.forEach((c) => root.classList.remove(c));
    if (color !== "rouge") {
      root.classList.add(color);
    }

    // Apply dark/light mode
    if (mode === "auto") {
      root.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      root.classList.toggle("dark", mode === "dark");
    }
  },
}));
