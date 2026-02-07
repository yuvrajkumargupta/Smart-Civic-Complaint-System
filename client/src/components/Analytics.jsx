import { useEffect, useState } from "react";
import API from "../api/axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/complaints/analytics");
      setData(res.data);
    } catch {
      alert("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  const categoryLabels = data.categoryStats.map((c) => c._id);
  const categoryCounts = data.categoryStats.map((c) => c.count);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>System Analytics</h3>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div>📌 Total: {data.totalComplaints}</div>
        <div>✅ Resolved: {data.resolvedCount}</div>
        <div>⏳ Pending: {data.pendingCount}</div>
        <div>📊 Resolution Rate: {data.resolutionRate}%</div>
        <div>⏱ Avg Time: {data.avgResolutionTime} hrs</div>
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ width: "400px" }}>
          <Bar
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  label: "Complaints by Category",
                  data: categoryCounts,
                },
              ],
            }}
          />
        </div>

        <div style={{ width: "300px" }}>
          <Pie
            data={{
              labels: ["Resolved", "Pending"],
              datasets: [
                {
                  data: [data.resolvedCount, data.pendingCount],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
