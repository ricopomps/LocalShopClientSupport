"use client";

import { isServer } from "@/utils/utils";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

//Note: For production use next-themes

type Theme = "ligth" | "dark";

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContext | null>(null);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (isServer()) return "ligth";
    return (localStorage.getItem("theme") as Theme) || "ligth";
  });

  useEffect(() => {
    document.documentElement.classList.remove("ligth", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const providerValue = useMemo<ThemeContext>(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw Error("useTheme must be used within a ThemeProvider");
  return context;
}
