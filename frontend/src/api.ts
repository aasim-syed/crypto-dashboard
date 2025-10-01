import axios from "axios";

// Extend ImportMeta interface to include 'env'
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API = axios.create({
  baseURL: API_BASE,
  // we’re using Bearer tokens, not cookies:
  withCredentials: false,
});

// attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
