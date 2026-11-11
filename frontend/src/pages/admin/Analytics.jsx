// frontend/src/pages/admin/Analytics.jsx
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api, { apiError } from "../../api/client";
import { money } from "../../components/ProgramCard";
import { useToast } from "../../components/Toast";

export default function Analytics() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/analytics")
      .then((response) => setData(response.data))
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <p className="muted">Loading analytics...</p>;
  if (!data) return <p className="muted">No analytics available.</p>;

  return (
    <div className="stack">
      <div>
        <h1>Analytics</h1>
        <p className="muted">Live totals from the platform database.</p>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <span className="stat-value">{money(data.total_donations)}</span>
          <span className="stat-label">Total donations</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{data.active_programs}</span>
          <span className="stat-label">Active programs</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{data.student_participation}</span>
          <span className="stat-label">Students approved</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{data.mentorship_acceptance_rate}%</span>
          <span className="stat-label">Mentorship acceptance</span>
        </div>
      </div>

      <section className="card">
        <h2>Donations per month</h2>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.donations_per_month}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="amount" fill="#1f6f5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Top five NGOs by funds raised</h2>
        {data.top_ngos.length === 0 ? (
          <p className="muted">No program donations yet.</p>
        ) : (
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.top_ngos} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Bar dataKey="total" fill="#c26a2b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Platform counts</h2>
        <div className="grid grid-3">
          <div className="stat">
            <span className="stat-value">{data.counts.users}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat">
            <span className="stat-value">{data.counts.programs}</span>
            <span className="stat-label">Programs</span>
          </div>
          <div className="stat">
            <span className="stat-value">{data.counts.donations}</span>
            <span className="stat-label">Successful donations</span>
          </div>
        </div>
      </section>
    </div>
  );
}
