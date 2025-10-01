import React from "react";
import { CoinRow } from "../types";

export default function CoinTable({ rows, onSelect }: { rows: CoinRow[]; onSelect: (id: string)=>void }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>#</th><th>Coin</th><th>Price</th><th>24h %</th><th>Volume</th><th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} onClick={() => onSelect(r.id)}>
            <td>{r.market_cap_rank}</td>
            <td><strong>{r.name}</strong> <span className="muted">({r.symbol.toUpperCase()})</span></td>
            <td>${r.price.toLocaleString()}</td>
            <td className={r.pct_change_24h >= 0 ? "pos" : "neg"}>
              {r.pct_change_24h.toFixed(2)}%
            </td>
            <td>${Math.round(r.volume).toLocaleString()}</td>
            <td>${Math.round(r.market_cap).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
