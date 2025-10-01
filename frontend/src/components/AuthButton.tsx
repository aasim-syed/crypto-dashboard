import React, { useState } from "react";
import { useAuth } from "../auth";
import AuthModal from "./AuthModal";

export default function AuthButton() {
  const { user, logout, ensureLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  if (!ensureLoaded) return null;

  return (
    <>
      {user ? (
        <div className="row" style={{ gap: 8 }}>
          <div className="muted">@{user.username}</div>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>
      ) : (
        <button className="btn ghost" onClick={() => setOpen(true)}>Login</button>
      )}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
