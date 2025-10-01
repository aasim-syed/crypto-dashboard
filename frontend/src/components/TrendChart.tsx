import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
  ChartData,
} from "chart.js";
import { History } from "../types";

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip, Legend, CategoryScale, Filler);

type Props = {
  history: History | null;
  loading?: boolean;
};

export default function TrendChart({ history, loading }: Props) {
  // Skeleton shimmer while loading
  if (loading) {
    return (
      <div className="card chart-skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-chart" />
      </div>
    );
  }

  // If no data
  if (!history || !history.series || history.series.length === 0) {
    return <div className="card">No chart data available</div>;
  }

  // Prepare labels & values
  const labels = history.series.map((p) => new Date(p.ts).toLocaleDateString());
  const values = history.series.map((p) => p.price);

  // Gradient data generator
  const data = useMemo(
    () =>
      (canvas: HTMLCanvasElement): ChartData<"line", number[], string> => {
        const ctx = canvas.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "rgba(94,139,255,0.4)");
        grad.addColorStop(1, "rgba(94,139,255,0)");

        return {
          labels,
          datasets: [
            {
              label: "Price (USD)",
              data: values,
              borderColor: "#5e8bff",
              backgroundColor: grad,
              tension: 0.35,
              pointRadius: 0,
              fill: true,
            },
          ],
        };
      },
    [labels, values]
  );

  return (
    <div className="card" data-tour-id="chart">
      <h3 className="card-title">{history.coin_id} — 30-day Price</h3>
      <div className="chart-wrap">
        <Line
          data={data as unknown as ChartData<"line">}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` $${Number(ctx.parsed.y).toLocaleString()}`,
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "var(--text-muted)" },
                grid: { color: "var(--grid-color)" },
              },
              y: {
                ticks: { color: "var(--text-muted)" },
                grid: { color: "var(--grid-color)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
