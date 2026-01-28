"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string; // nama key buat simpen pilihan user di localStorage
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// state awal biar gak error pas pertama kali aplikasi jalan
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// bikin konteks buat nyimpen status tema secara global
const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // ambil tema dari localStorage biar pas refresh temanya gak balik ke awal
  const [theme, setTheme] = React.useState<Theme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(storageKey) as Theme)) || defaultTheme
  );

  // efek buat ganti class di tag <html> biar dark mode 
  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    // logic buat deteksi tema asli dari sistem user
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // simpen pilihan user ke browser
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// hook biar bisa ganti tema dari tombol mana aja 
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};