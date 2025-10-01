import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeSeriesScale, Tooltip, Legend, CategoryScale } from "chart.js";
import { History } from "../types";

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip, Legend, CategoryScale);

export default function TrendChart({ history }: { history: History | null }) {
  if (!history || history.series.length === 0) return <div className="card">No data</div>;
  const labels = history.series.map(p => new Date(p.ts).toLocaleDateString());
  const data = history.series.map(p => p.price);
  return (
    <div className="card">
      <h3>{history.coin_id} — 30-day Price</h3>
      <Line data={{
        labels,
        datasets: [{ label: "Price (USD)", data }]
      }} options={{
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } }
      }}/>
    </div>
  );
}
