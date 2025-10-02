/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                     // ✅ enables global test functions (describe, it, expect)
    environment: "jsdom",              // ✅ simulates DOM for React tests
    setupFiles: "./src/setupTests.ts", // ✅ loads setup before tests
  },
  server: {
    port: 5173,
  },
});
