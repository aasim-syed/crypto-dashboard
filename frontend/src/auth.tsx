import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "./api";

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  ensureLoaded: boolean;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  ensureLoaded: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ensureLoaded, setEnsureLoaded] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (t) setToken(t);
    if (u) setUser({ username: u });
    setEnsureLoaded(true);
  }, []);

  async function login(username: string, password: string) {
    const { data } = await API.post("/auth/login", { username, password });
    const tok = data.access_token;
    localStorage.setItem("token", tok);
    localStorage.setItem("username", username);
    setToken(tok);
    setUser({ username });
  }

  async function register(username: string, password: string) {
    await API.post("/auth/register", { username, password });
    await login(username, password);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, token, login, register, logout, ensureLoaded }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
