// frontend/src/pages/student/DonationsReceived.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import { downloadReceipt } from "../../api/download";
import EmptyState from "../../components/EmptyState";
import { money } from "../../components/ProgramCard";
import { useToast } from "../../components/Toast";

export default function DonationsReceived() {
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
        <h1>Donations received</h1>
        <p className="muted">
          {summary.count} records. {money(summary.total)} credited to you.
        </p>
      </div>

      {donations.length === 0 ? (
        <EmptyState title="No donations yet" message="Donations directed to you appear here." />
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.donor_name}</td>
                  <td>{money(donation.amount)}</td>
                  <td>{donation.status}</td>
                  <td>{new Date(donation.created_at).toLocaleDateString("en-IN")}</td>
                  <td>
                    {donation.status === "success" ? (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => download(donation.id, donation.receipt_no)}
                      >
                        {donation.receipt_no}
                      </button>
                    ) : (
                      "No receipt"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
