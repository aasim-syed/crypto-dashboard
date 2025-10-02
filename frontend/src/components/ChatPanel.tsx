import React, { useState, useRef, useEffect } from "react";
import { API } from "../api";
import { QAResponse } from "../types";

export default function ChatPanel({ onIntent }: { onIntent: (r: QAResponse)=>void }) {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ me?: string; bot?: string }[]>([]);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send() {
    if (!q.trim() || sending) return;
    const me = q.trim();
    setQ("");
    setSending(true);
    try {
      const { data } = await API.post<QAResponse>("/qa", { query: me });
      setLog((l) => [...l, { me }, { bot: data.answer }]);
      onIntent(data); // trigger chart update if trend intent
    } catch {
      setLog((l) => [...l, { me }, { bot: "Error processing query." }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="chat">
      <div className="log">
        {log.map((m, i) =>
          m.me ? (
            <div key={i} className="bubble me">{m.me}</div>
          ) : (
            <div key={i} className="bubble bot">{m.bot}</div>
          )
        )}
      </div>

      <div className="chatbar">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask: What is the price of Bitcoin?"
          className="input"
        />

        <button
          onClick={send}
          disabled={!q.trim() || sending}
          className="btn btn-primary"
          aria-label="Send message"
          title="Send"
        >
          {/* Simple paper-plane icon (CSS mask) */}
          <span className="icon-send" aria-hidden />
          <span className="btn-text">Send</span>
        </button>
      </div>
    </div>
  );
}
