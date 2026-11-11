// frontend/src/pages/admin/Donations.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import { downloadReceipt } from "../../api/download";
import { money } from "../../components/ProgramCard";
import { useToast } from "../../components/Toast";

export default function AdminDonations() {
  const toast = useToast();
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/donations")
      .then((response) => {
        setDonations(response.data.donations);
        setSummary(response.data.summary);
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

  if (loading) return <p className="muted">Loading donations...</p>;

  return (
    <div className="stack">
      <div>
        <h1>All donations</h1>
        <p className="muted">
          {summary.count} records. {money(summary.total)} in successful donations.
        </p>
      </div>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor</th>
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
                <td>{donation.donor_name}</td>
                <td>{donation.program_title || donation.student_name || "-"}</td>
                <td>{money(donation.amount)}</td>
                <td>{donation.status}</td>
                <td>
                  {donation.status === "success" ? (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => download(donation.id, donation.receipt_no)}
                    >
                      PDF
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
    </div>
  );
}
