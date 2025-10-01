import React, { useEffect, useState } from "react";
import { API } from "./api";
import CoinTable from "./components/CoinTable";
import TrendChart from "./components/TrendChart";
import ChatPanel from "./components/ChatPanel";
import { CoinRow, History, QAResponse } from "./types";

export default function App() {
  const [rows, setRows] = useState<CoinRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<History | null>(null);

  async function loadTable() {
    const { data } = await API.get<CoinRow[]>("/coins", { params: { limit: 10 } });
    setRows(data);
    if (!selected && data.length) setSelected(data[0].id);
  }
  async function loadHistory(id: string) {
    const { data } = await API.get<History>(`/coins/${id}/history`, { params: { days: 30 } });
    setHistory(data);
  }

  useEffect(() => { loadTable(); }, []);
  useEffect(() => { if (selected) loadHistory(selected); }, [selected]);

  function onIntent(r: QAResponse) {
    if (r.intent === "trend_lookup" && r.coin_id) {
      setSelected(r.coin_id);
      // chart will refresh via useEffect
    }
  }

  return (
    <div className="layout">
      <header><h1>Crypto Dashboard</h1></header>
      <main>
        <section className="left">
          <div className="card">
            <div className="row">
              <h3>Top 10 Coins</h3>
              <button onClick={loadTable}>Refresh</button>
            </div>
            <CoinTable rows={rows} onSelect={(id)=>setSelected(id)} />
          </div>
          <TrendChart history={history} />
        </section>
        <aside className="right">
          <ChatPanel onIntent={onIntent}/>
          <div className="hint">
            Try:
            <ul>
              <li>What is the price of Bitcoin?</li>
              <li>Show me the 7-day trend of Ethereum.</li>
              <li>BTC</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
