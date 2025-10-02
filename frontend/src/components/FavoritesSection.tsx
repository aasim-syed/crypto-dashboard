import React, { useMemo } from "react";
import { CoinRow } from "../types";

type Props = {
  rows: CoinRow[];
  favorites: Set<string>;
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
  disabled?: boolean;
};

export default function FavoritesSection({ rows, favorites, onSelect, onToggleFav, disabled }: Props) {
  const favRows = useMemo(
    () => rows.filter(r => favorites.has(r.id)),
    [rows, favorites]
  );

  return (
    <div className="card">
      <div className="row between">
        <h3 className="card-title">Your Favorites</h3>
        <span className="pill">{favRows.length}</span>
      </div>

      {disabled && <div className="hint">Login to add favorites.</div>}

      {!disabled && favRows.length === 0 && (
        <div className="hint">Click the ★ star in the table to add favorites.</div>
      )}

      {!disabled && favRows.length > 0 && (
        <ul className="fav-list">
          {favRows.map((c) => (
            <li key={c.id} className="fav-item">
              <button className="fav-name" onClick={() => onSelect(c.id)} title="Show trend">
                {c.name} <span className="sym">({c.symbol.toUpperCase()})</span>
              </button>
              <div className="fav-meta">
                <span className="price">${c.price.toLocaleString()}</span>
                <span className={`chg ${c.pct_change_24h >= 0 ? "up" : "down"}`}>
                  {c.pct_change_24h.toFixed(2)}%
                </span>
              </div>
              <button className="btn tiny ghost" onClick={() => onToggleFav(c.id)} title="Remove favorite">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
