import React from "react";

type Props = {
  mode: "all" | "faves";
  count: number;
  onChange: (m: "all" | "faves") => void;
  disabled?: boolean;
};

export default function FavoritesToggle({ mode, count, onChange, disabled }: Props) {
  return (
    <div className={`segmented ${disabled ? "is-disabled" : ""}`} role="tablist" aria-label="View selector">
      <button
        role="tab"
        aria-selected={mode === "all"}
        className={mode === "all" ? "seg active" : "seg"}
        onClick={() => onChange("all")}
        disabled={disabled}
        title={disabled ? "Login to manage favorites" : "Show all coins"}
      >
        All
      </button>
      <button
        role="tab"
        aria-selected={mode === "faves"}
        className={mode === "faves" ? "seg active" : "seg"}
        onClick={() => onChange("faves")}
        disabled={disabled}
        title={disabled ? "Login to view favorites" : "Show favorites only"}
      >
        ★ Favorites <span className="badge">{count}</span>
      </button>
    </div>
  );
}