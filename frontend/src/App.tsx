import React, { useEffect, useMemo, useState } from "react";
import { API } from "./api";
import CoinTable from "./components/CoinTable";
import TrendChart from "./components/TrendChart";
import ChatPanel from "./components/ChatPanel";
import { CoinRow, History, QAResponse } from "./types";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./theme";
import Walkthrough from "./components/Walkthrough";
import AuthButton from "./components/AuthButton";
import { fetchFavorites, addFavorite, removeFavorite } from "./favorites";
import { useAuth } from "./auth";
import FavoritesToggle from "./components/FavoritesToggle";
import FavoritesSection from "./components/FavoritesSection";

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

function Shell() {
  const [rows, setRows] = useState<CoinRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [sort, setSort] = useState<string>("market_cap_rank");

  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"all" | "faves">("all");

  async function loadFavorites() {
    if (!user) { setFavorites(new Set()); return; }
    const list = await fetchFavorites(); // expects string[] coin ids
    setFavorites(new Set(list));
  }
  useEffect(() => { loadFavorites(); }, [user]);

  async function toggleFavorite(coinId: string) {
    if (!user) {
      alert("Please login to manage favorites.");
      return;
    }
    if (favorites.has(coinId)) await removeFavorite(coinId);
    else await addFavorite(coinId);
    loadFavorites();
  }

  async function loadTable() {
    const { data } = await API.get<CoinRow[]>("/coins", { params: { limit: 10, sort } });
    setRows(data);
    if (!selected && data.length) setSelected(data[0].id);
  }

  async function loadHistory(id: string) {
    const { data } = await API.get<History>(`/coins/${id}/history`, { params: { days: 30 } });
    setHistory(data);
  }

  useEffect(() => { loadTable(); }, [sort]);
  useEffect(() => { if (selected) loadHistory(selected); }, [selected]);

  function onIntent(r: QAResponse) {
    if (r.intent === "trend_lookup" && r.coin_id) setSelected(r.coin_id);
  }

  // ---------- Sorting helpers (works for both All + Favorites) ----------
  function sortRows(list: CoinRow[], sortKey: string): CoinRow[] {
    const arr = [...list];
    switch (sortKey) {
      case "price":
        return arr.sort((a, b) => b.price - a.price);
      case "volume":
        return arr.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
      case "market_cap":
        return arr.sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0));
      case "pct_change_24h":
        return arr.sort((a, b) => (b.pct_change_24h ?? 0) - (a.pct_change_24h ?? 0));
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "market_cap_rank":
      default:
        // rank ASC (1 is best). Use large default to push unknowns down.
        return arr.sort((a, b) => (a.market_cap_rank ?? 9e9) - (b.market_cap_rank ?? 9e9));
    }
  }

  // All coins (sorted)
  const sortedAll = useMemo(() => sortRows(rows, sort), [rows, sort]);

  // Visible rows (All or Favorites subset, both sorted client-side)
  const visibleRows = useMemo(() => {
    if (viewMode === "faves") {
      const onlyFavs = rows.filter((r) => favorites.has(r.id));
      return sortRows(onlyFavs, sort);
    }
    return sortedAll;
  }, [viewMode, rows, favorites, sort, sortedAll]);

  // Keep a valid selection when visibleRows change (esp. in Favorites mode)
  useEffect(() => {
    if (!visibleRows.length) return;
    const stillVisible = visibleRows.some((r) => r.id === selected);
    if (!stillVisible) setSelected(visibleRows[0].id);
  }, [visibleRows]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps = [
    { id: "sort",  title: "Sort Coins", body: "Use this to sort by rank, price, volume, market cap or 24h %." },
    { id: "table", title: "Top Coins", body: "Click any row to load its 30-day price trend." },
    { id: "chart", title: "Trend Chart", body: "Visualize historical price trends with a smooth gradient chart." },
    { id: "chat",  title: "Chat Assistant", body: "Ask natural questions like 'price of bitcoin' or '7-day trend of ethereum'." },
  ];

  return (
    <>
      <header className="hdr">
        <div className="hdr-left">
          <div className="logo">₿ Crypto Dashboard</div>
          <div className="tag">Pro</div>
        </div>
        <div className="hdr-right">
          <AuthButton />
          <ThemeToggle />
          <button
            className="btn ghost"
            onClick={() => { localStorage.removeItem("tour_seen"); location.reload(); }}
          >
            ❓ Tour
          </button>
        </div>
      </header>

      <main className="grid">
        <section className="left">
          <div className="card" data-tour-id="sort">
            <div className="row wrap" style={{ gap: 8 }}>
              <h3 className="card-title">Coins</h3>

              <FavoritesToggle
                mode={viewMode}
                count={favorites.size}
                onChange={setViewMode}
                disabled={!user}
              />

              <div className="row" style={{ gap: 8, marginLeft: "auto" }}>
                <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="market_cap_rank">Rank</option>
                  <option value="price">Price</option>
                  <option value="volume">Volume</option>
                  <option value="market_cap">Market Cap</option>
                  <option value="pct_change_24h">% 24h</option>
                  <option value="name">Name</option>
                </select>
                <button className="btn" onClick={loadTable}>Refresh</button>
              </div>
            </div>

            <div data-tour-id="table">
              <CoinTable
                rows={visibleRows}
                onSelect={setSelected}
                favorites={favorites}
                onToggleFav={toggleFavorite}
              />
              {viewMode === "faves" && visibleRows.length === 0 && (
                <div className="hint" style={{ marginTop: 8 }}>
                  {user ? "No favorites yet. Click the ★ star in the table to add some."
                        : "Login to start adding favorites."}
                </div>
              )}
            </div>
          </div>

          <TrendChart history={history} />
        </section>

        <aside className="right">
          <FavoritesSection
            rows={rows}
            favorites={favorites}
            onSelect={setSelected}
            onToggleFav={toggleFavorite}
            disabled={!user}
          />

          <div className="card" data-tour-id="chat">
            <h3 className="card-title">Chat Assistant</h3>
            <ChatPanel onIntent={onIntent} />
            <div className="hint">
              Try:
              <ul>
                <li>price of bitcoin</li>
                <li>7-day trend of ethereum</li>
                <li>btc</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <Walkthrough steps={steps} openByDefault />
    </>
  );
}
