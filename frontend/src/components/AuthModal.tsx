import React, { useState } from "react";
import { useAuth } from "../auth";

export default function AuthModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{mode === "login" ? "Login" : "Create account"}</h3>
        <form onSubmit={submit} className="col" style={{ gap: 10 }}>
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <div className="error">{err}</div>}
          <div className="row" style={{ justifyContent: "space-between" }}>
            <button type="button" className="btn ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create account" : "I have an account"}
            </button>
            <button type="submit" className="btn" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
