/// <reference types="vitest" />
// @vitest-environment node

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const createMock = vi.fn((opts?: any) => ({
  defaults: { baseURL: opts?.baseURL },
  interceptors: { request: { use: vi.fn() } },
}));

vi.mock("axios", () => {
  return {
    default: {
      create: createMock,
    },
  };
});

async function importFreshApi() {
  vi.resetModules();   // force re-import
  return await import("../../api");
}

let OLD_ENV: any;

beforeEach(() => {
  OLD_ENV = { ...import.meta.env };
  vi.clearAllMocks();
});

afterEach(() => {
  // @ts-ignore
  import.meta.env = OLD_ENV;
});

describe("API base URL config", () => {
  it("uses VITE_API_URL when defined", async () => {
    // @ts-ignore
    import.meta.env.VITE_API_URL = "https://crypto-dashboard-ldxf.onrender.com";

    const { API } = await importFreshApi();

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "https://crypto-dashboard-ldxf.onrender.com" }),
    );
    // @ts-ignore
    expect(API.defaults.baseURL).toBe("https://crypto-dashboard-ldxf.onrender.com");
  });

it("falls back to http://localhost:8000 when VITE_API_URL not set", async () => {
  // @ts-ignore
  import.meta.env.VITE_API_URL = undefined;   // ✅ safer than delete

  const { API } = await importFreshApi();

  expect(createMock).toHaveBeenCalledWith(
    expect.objectContaining({ baseURL: "http://localhost:8000" }),
  );
  // @ts-ignore
  expect(API.defaults.baseURL).toBe("http://localhost:8000");
});

});
