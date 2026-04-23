import { useEffect, useState } from "react";

const THEME_KEY = "app-theme";

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};

export default useTheme;
