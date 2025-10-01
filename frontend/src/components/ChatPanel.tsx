import React, { useState } from "react";
import { API } from "../api";
import { QAResponse } from "../types";

export default function ChatPanel({ onIntent }: { onIntent: (r: QAResponse)=>void }) {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ me?: string; bot?: string }[]>([]);

  async function send() {
    if (!q.trim()) return;
    const me = q;
    setQ("");
    try {
      const { data } = await API.post<QAResponse>("/qa", { query: me });
      setLog(l => [...l, { me }, { bot: data.answer }]);
      onIntent(data); // to trigger chart update if trend intent
    } catch (e:any) {
      setLog(l => [...l, { me }, { bot: "Error processing query." }]);
    }
  }

  return (
    <div className="chat">
      <div className="log">
        {log.map((m, i) => m.me
          ? <div key={i} className="bubble me">{m.me}</div>
          : <div key={i} className="bubble bot">{m.bot}</div>
        )}
      </div>
      <div className="chatbar">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask: What is the price of Bitcoin?"/>
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
