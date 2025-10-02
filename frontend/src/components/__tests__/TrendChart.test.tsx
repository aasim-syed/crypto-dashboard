
import { render, screen } from "@testing-library/react";
import TrendChart from "../TrendChart";
import { History } from "../../types";
import { describe, expect, it } from "vitest";

const history: History = {
  coin_id: "bitcoin",
  series: [
    { ts: new Date().toISOString(), price: 61000 },
    { ts: new Date(Date.now() - 86400000).toISOString(), price: 60500 },
  ],
};

describe("TrendChart", () => {
  it("renders title and no crash", () => {
    render(<TrendChart history={history} loading={false} />);
    expect(screen.getByText(/bitcoin — 30-day price/i)).toBeInTheDocument();
  });

  it("renders placeholder when no data", () => {
    render(<TrendChart history={null} loading={false} />);
    expect(screen.getByText(/No chart data available/i)).toBeInTheDocument();
  });
});
