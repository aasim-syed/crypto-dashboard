/// <reference types="vite/client" />
import axios from "axios";
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});
// don't send cookies unless you need them
API.defaults.withCredentials = false;
