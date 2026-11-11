// frontend/src/pages/donor/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client";
import { downloadReceipt } from "../../api/download";
import EmptyState from "../../components/EmptyState";
import { money } from "../../components/ProgramCard";
import { useToast } from "../../components/Toast";

export default function DonorDashboard() {
  const toast = useToast();
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/donations"), api.get("/programs")])
      .then(([donationResponse, programResponse]) => {
        setDonations(donationResponse.data.donations);
        setSummary(donationResponse.data.summary);
        setPrograms(programResponse.data.programs);
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  async function download(id, receiptNo) {
    try {
      await downloadReceipt(id, receiptNo);
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  if (loading) return <p className="muted">Loading dashboard...</p>;

  const success = donations.filter((row) => row.status === "success");
  const students = new Set(success.filter((row) => row.student_id).map((row) => row.student_id));
  const programTotals = {};
  success.forEach((row) => {
    if (row.program_id) {
      programTotals[row.program_id] = (programTotals[row.program_id] || 0) + row.amount;
    }
  });

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Donor dashboard</h1>
          <p className="muted">Giving history and impact per program.</p>
        </div>
        <Link className="btn btn-primary" to="/donor/donate">Donate</Link>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <span className="stat-value">{money(summary.total)}</span>
          <span className="stat-label">Given</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{success.length}</span>
          <span className="stat-label">Successful donations</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{Object.keys(programTotals).length}</span>
          <span className="stat-label">Programs supported</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{students.size}</span>
          <span className="stat-label">Students funded</span>
        </div>
      </div>

      <section className="card stack">
        <h2>Impact per program</h2>
        {Object.keys(programTotals).length === 0 ? (
          <p className="muted">No program donations yet.</p>
        ) : (
          Object.entries(programTotals).map(([programId, amount]) => {
            const program = programs.find((row) => row.id === Number(programId));
            const target = Number(program?.target_amount || 0);
            const percent = target > 0 ? Math.min(100, Math.round((amount / target) * 100)) : 0;
            return (
              <div key={programId}>
                <div className="row between wrap">
                  <strong>{program?.title || `Program ${programId}`}</strong>
                  <span className="small muted">
                    You gave {money(amount)} of {money(target)}
                  </span>
                </div>
                <div className="progress">
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="card">
        <h2>Giving history</h2>
        {donations.length === 0 ? (
          <EmptyState
            title="No donations yet"
            message="Fund a program or a student to get started."
            action={<Link className="text-link" to="/donor/donate">Donate now</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Target</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.created_at).toLocaleDateString("en-IN")}</td>
                    <td>{donation.program_title || donation.student_name || "-"}</td>
                    <td>{money(donation.amount)}</td>
                    <td>{donation.status}</td>
                    <td>
                      {donation.status === "success" ? (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => download(donation.id, donation.receipt_no)}
                        >
                          Download
                        </button>
                      ) : (
                        "Failed"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
