import React, { useEffect, useState } from "react";
import { API } from "./api";
import CoinTable from "./components/CoinTable";
import TrendChart from "./components/TrendChart";
import ChatPanel from "./components/ChatPanel";
import { CoinRow, History, QAResponse } from "./types";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./theme";
import Walkthrough from "./components/Walkthrough";

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
            <div className="row">
              <h3 className="card-title">Top 10 Coins</h3>
              <div className="row" style={{ gap: 8 }}>
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
              <CoinTable rows={rows} onSelect={setSelected} />
            </div>
          </div>

          <TrendChart history={history} />
        </section>

        <aside className="right">
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
