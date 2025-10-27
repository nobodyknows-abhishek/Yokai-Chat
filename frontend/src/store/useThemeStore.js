import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Yokai-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Yokai-theme", theme);
    set({ theme });
  },
}));
