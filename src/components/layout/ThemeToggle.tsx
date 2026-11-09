"use client";

import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      onClick={handleClick}
      data-theme={theme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className={styles.icons} aria-hidden="true">
        <Sun className={styles.sun} size={15} strokeWidth={1.6} />
        <Moon className={styles.moon} size={15} strokeWidth={1.6} />
      </span>
    </button>
  );
}
