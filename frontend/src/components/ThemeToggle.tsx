import React from "react";
import { useTheme } from "../theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="btn ghost" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
