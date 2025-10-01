import React from "react";
import { CoinRow } from "../types";

type Props = {
  rows: CoinRow[];
  onSelect: (id: string) => void;
  favorites?: Set<string>;
  onToggleFav?: (id: string) => void;
};

export default function CoinTable({ rows, onSelect, favorites, onToggleFav }: Props) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ width: 32 }}></th>
          <th>Coin</th>
          <th className="right">Price</th>
          <th className="right">% 24h</th>
          <th className="right">Volume</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} onClick={() => onSelect(r.id)}>
            <td onClick={(e) => e.stopPropagation()}>
              {onToggleFav && (
                <button
                  className={`star ${favorites?.has(r.id) ? "active" : ""}`}
                  title={favorites?.has(r.id) ? "Unfavorite" : "Favorite"}
                  onClick={() => onToggleFav(r.id)}
                >
                  ⭐
                </button>
              )}
            </td>
            <td>{r.name} <span className="muted">({r.symbol?.toUpperCase()})</span></td>
            <td className="right">${Number(r.price).toLocaleString()}</td>
            <td className="right">
              <span className={r.pct_change_24h >= 0 ? "pos" : "neg"}>
                {r.pct_change_24h?.toFixed(2)}%
              </span>
            </td>
            <td className="right">${Number(r.volume).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
