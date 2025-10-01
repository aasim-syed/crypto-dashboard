import React from "react";
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
  ChartOptions,
  Chart as ChartType,
} from "chart.js";
import { History } from "../types";

// Register chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Tooltip, Legend, CategoryScale, Filler);

type Props = {
  history: History | null;
  loading?: boolean;
};

// --- Custom Crosshair Plugin ---
const crosshairPlugin = {
  id: "crosshair",
  afterDatasetsDraw(chart: ChartType) {
    if (!chart.tooltip?.getActiveElements().length) return;

    const { ctx } = chart;
    const active = chart.tooltip.getActiveElements()[0];
    if (!active) return;

    const x = chart.scales.x.getPixelForValue(active.index);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chart.chartArea.top);
    ctx.lineTo(x, chart.chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#888";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(crosshairPlugin);

export default function TrendChart({ history, loading }: Props) {
  // Skeleton shimmer
  if (loading) {
    return (
      <div className="card chart-skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-chart" />
      </div>
    );
  }

  // No data
  if (!history || !Array.isArray(history.series) || history.series.length === 0) {
    return <div className="card">No chart data available</div>;
  }

  // Prepare labels and values
  const labels = history.series.map((p) => new Date(p.ts).toLocaleDateString());
  const values = history.series.map((p) => p.price);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Price (USD)",
        data: values,
        borderColor: "#5e8bff",
        backgroundColor: "rgba(94,139,255,0.25)",
        tension: 0.35,
        pointRadius: 3,          // small dots to hover
        pointHoverRadius: 6,     // bigger on hover
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index",     // hover entire vertical slice
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          title: (ctx) => ctx[0].label || "",
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
  };

  return (
    <div className="card" data-tour-id="chart">
      <h3 className="card-title">{history.coin_id} — 30-day Price</h3>
      <div className="chart-wrap">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
